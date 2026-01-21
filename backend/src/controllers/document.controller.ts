import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware';
import aiService from '../services/ai';
import pdfService from '../services/pdf';
import { emailService } from '../services/email';

// Get all documents
export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user!.id },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            type: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to get documents' });
  }
};

// Get single document
export const getDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      include: {
        template: true,
        versions: {
          orderBy: { version: 'desc' },
          take: 10,
        },
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to get document' });
  }
};

// Create document
export const createDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { type, name, templateId, jobDescription, jobUrl, jobTitle, companyName } = req.body;

    // Verify template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(400).json({ error: 'Template not found' });
    }

    // Create document with default content
    const document = await prisma.document.create({
      data: {
        userId: req.user!.id,
        type,
        name,
        templateId,
        jobDescription,
        jobUrl,
        jobTitle,
        companyName,
        content: {
          sections: template.defaultSections,
          customizations: {
            primaryColor: '#2563eb',
            secondaryColor: '#64748b',
            fontFamily: 'Inter',
            fontSize: '11pt',
            spacing: 'normal',
          },
        },
      },
      include: {
        template: true,
      },
    });

    res.status(201).json({ document });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
};

// Update document
export const updateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, content, jobDescription, jobTitle, companyName } = req.body;

    // Verify ownership
    const existing = await prisma.document.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Get current version count
    const versionCount = await prisma.documentVersion.count({
      where: { documentId: id },
    });

    // Create version before update
    if (content) {
      await prisma.documentVersion.create({
        data: {
          documentId: id,
          version: versionCount + 1,
          content: existing.content,
        },
      });
    }

    const document = await prisma.document.update({
      where: { id },
      data: {
        name,
        content,
        jobDescription,
        jobTitle,
        companyName,
      },
      include: {
        template: true,
      },
    });

    res.json({ document });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

// Delete document
export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await prisma.document.delete({ where: { id } });

    res.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

// Generate CV with AI
export const generateCV = async (req: AuthRequest, res: Response) => {
  try {
    const { templateId, jobDescription, jobTitle, companyName, tone } = req.body;

    // Check credits
    const credits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    const cvCostConfig = await prisma.systemConfig.findUnique({
      where: { key: 'cv_generation_cost' },
    });
    const cvCost = parseFloat(cvCostConfig?.value || '1');

    if (!credits || credits.balance < cvCost) {
      return res.status(402).json({ 
        error: 'Insufficient credits',
        required: cvCost,
        balance: credits?.balance || 0,
      });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        education: { orderBy: { startDate: 'desc' } },
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (!profile) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(400).json({ error: 'Template not found' });
    }

    // Generate content with AI
    const result = await aiService.generateContent({
      profile,
      jobDescription,
      jobTitle,
      companyName,
      templateSections: template.defaultSections as any[],
      type: 'CV',
      tone,
    });

    // Create document
    const document = await prisma.document.create({
      data: {
        userId: req.user!.id,
        type: 'CV',
        name: `CV - ${jobTitle || companyName || 'Custom'}`,
        templateId,
        jobDescription,
        jobTitle,
        companyName,
        atsScore: result.atsScore,
        content: {
          sections: result.content,
          customizations: {
            primaryColor: '#2563eb',
            secondaryColor: '#64748b',
            fontFamily: 'Inter',
            fontSize: '11pt',
            spacing: 'normal',
          },
          keywords: result.keywords,
          suggestions: result.suggestions,
        },
      },
      include: {
        template: true,
      },
    });

    // Deduct credits
    await prisma.userCredits.update({
      where: { userId: req.user!.id },
      data: {
        balance: { decrement: cvCost },
        totalUsed: { increment: cvCost },
      },
    });

    // Log usage
    await prisma.creditUsage.create({
      data: {
        userId: req.user!.id,
        credits: cvCost,
        action: 'CV_GENERATION',
        documentId: document.id,
      },
    });

    // Check low credits warning
    const updatedCredits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    const lowThresholdConfig = await prisma.systemConfig.findUnique({
      where: { key: 'low_credit_threshold' },
    });
    const lowThreshold = parseFloat(lowThresholdConfig?.value || '2');

    if (updatedCredits && updatedCredits.balance <= lowThreshold) {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });
      if (user) {
        await emailService.sendLowCreditsWarning(user.email, user.name || '', updatedCredits.balance);
      }
    }

    res.status(201).json({
      document,
      atsScore: result.atsScore,
      keywords: result.keywords,
      suggestions: result.suggestions,
      creditsRemaining: updatedCredits?.balance || 0,
    });
  } catch (error) {
    console.error('Generate CV error:', error);
    res.status(500).json({ error: 'Failed to generate CV' });
  }
};

// Generate Cover Letter with AI
export const generateCoverLetter = async (req: AuthRequest, res: Response) => {
  try {
    const { templateId, jobDescription, jobTitle, companyName, tone, cvId } = req.body;

    // Check credits
    const credits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    const clCostConfig = await prisma.systemConfig.findUnique({
      where: { key: 'cover_letter_cost' },
    });
    const clCost = parseFloat(clCostConfig?.value || '1');

    if (!credits || credits.balance < clCost) {
      return res.status(402).json({
        error: 'Insufficient credits',
        required: clCost,
        balance: credits?.balance || 0,
      });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
      include: {
        experiences: { orderBy: { startDate: 'desc' }, take: 3 },
        education: { orderBy: { startDate: 'desc' }, take: 2 },
        skills: { take: 10 },
        user: { select: { name: true, email: true } },
      },
    });

    if (!profile) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(400).json({ error: 'Template not found' });
    }

    // Generate content with AI
    const result = await aiService.generateContent({
      profile,
      jobDescription,
      jobTitle,
      companyName,
      templateSections: template.defaultSections as any[],
      type: 'COVER_LETTER',
      tone,
    });

    // Create document
    const document = await prisma.document.create({
      data: {
        userId: req.user!.id,
        type: 'COVER_LETTER',
        name: `Cover Letter - ${companyName || jobTitle || 'Custom'}`,
        templateId,
        jobDescription,
        jobTitle,
        companyName,
        atsScore: result.atsScore,
        content: {
          sections: result.content,
          customizations: {
            primaryColor: '#2563eb',
            secondaryColor: '#64748b',
            fontFamily: 'Inter',
            fontSize: '11pt',
            spacing: 'normal',
          },
        },
      },
      include: {
        template: true,
      },
    });

    // Deduct credits
    await prisma.userCredits.update({
      where: { userId: req.user!.id },
      data: {
        balance: { decrement: clCost },
        totalUsed: { increment: clCost },
      },
    });

    // Log usage
    await prisma.creditUsage.create({
      data: {
        userId: req.user!.id,
        credits: clCost,
        action: 'COVER_LETTER_GENERATION',
        documentId: document.id,
      },
    });

    const updatedCredits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    res.status(201).json({
      document,
      atsScore: result.atsScore,
      keywords: result.keywords,
      suggestions: result.suggestions,
      creditsRemaining: updatedCredits?.balance || 0,
    });
  } catch (error) {
    console.error('Generate cover letter error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
};

// Download PDF
export const downloadPDF = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: { id, userId: req.user!.id },
      include: { template: true },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if user is on free tier (needs watermark)
    const credits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    const watermarkConfig = await prisma.systemConfig.findUnique({
      where: { key: 'watermark_free' },
    });
    const shouldWatermark = watermarkConfig?.value === 'true' && 
      credits && credits.totalPurchased <= 3;

    // Generate HTML based on document type
    const html = document.type === 'CV'
      ? pdfService.generateCVHTML(document.content, document.template)
      : pdfService.generateCoverLetterHTML(document.content, document.template);

    // Generate PDF
    const pdfBuffer = await pdfService.generatePDF(html, { 
      watermark: shouldWatermark 
    });

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${document.name.replace(/[^a-z0-9]/gi, '_')}.pdf"`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

// Optimize for ATS
export const optimizeATS = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!document.jobDescription) {
      return res.status(400).json({ error: 'Job description is required for ATS optimization' });
    }

    // Check credits
    const credits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    const atsCostConfig = await prisma.systemConfig.findUnique({
      where: { key: 'ats_optimization_cost' },
    });
    const atsCost = parseFloat(atsCostConfig?.value || '0.5');

    if (!credits || credits.balance < atsCost) {
      return res.status(402).json({
        error: 'Insufficient credits',
        required: atsCost,
        balance: credits?.balance || 0,
      });
    }

    // Calculate ATS score
    const result = await aiService.calculateATSScore(document.content, document.jobDescription);

    // Update document
    await prisma.document.update({
      where: { id },
      data: { atsScore: result.score },
    });

    // Deduct credits
    await prisma.userCredits.update({
      where: { userId: req.user!.id },
      data: {
        balance: { decrement: atsCost },
        totalUsed: { increment: atsCost },
      },
    });

    // Log usage
    await prisma.creditUsage.create({
      data: {
        userId: req.user!.id,
        credits: atsCost,
        action: 'ATS_OPTIMIZATION',
        documentId: id,
      },
    });

    const updatedCredits = await prisma.userCredits.findUnique({
      where: { userId: req.user!.id },
    });

    res.json({
      score: result.score,
      feedback: result.feedback,
      creditsRemaining: updatedCredits?.balance || 0,
    });
  } catch (error) {
    console.error('ATS optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize for ATS' });
  }
};

// Get document versions
export const getVersions = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const versions = await prisma.documentVersion.findMany({
      where: { documentId: id },
      orderBy: { version: 'desc' },
    });

    res.json({ versions });
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({ error: 'Failed to get versions' });
  }
};

// Restore version
export const restoreVersion = async (req: AuthRequest, res: Response) => {
  try {
    const { id, versionId } = req.params;

    const document = await prisma.document.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const version = await prisma.documentVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.documentId !== id) {
      return res.status(404).json({ error: 'Version not found' });
    }

    // Save current as new version
    const versionCount = await prisma.documentVersion.count({
      where: { documentId: id },
    });

    await prisma.documentVersion.create({
      data: {
        documentId: id,
        version: versionCount + 1,
        content: document.content,
      },
    });

    // Restore old version
    const updated = await prisma.document.update({
      where: { id },
      data: { content: version.content },
      include: { template: true },
    });

    res.json({ document: updated });
  } catch (error) {
    console.error('Restore version error:', error);
    res.status(500).json({ error: 'Failed to restore version' });
  }
};
