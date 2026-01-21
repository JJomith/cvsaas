import { Request, Response } from 'express';
import prisma from '../config/database';
import jobScraperService from '../services/scraper';
import aiService from '../services/ai';

// Scrape job from URL
export const scrapeJobUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const jobDetails = await jobScraperService.scrapeJobUrl(url);

    // Analyze with AI
    const analysis = await aiService.analyzeJobDescription(jobDetails.description);

    res.json({
      job: {
        ...jobDetails,
        title: analysis.title || jobDetails.title,
        company: analysis.company || jobDetails.company,
      },
      analysis: {
        requirements: analysis.requirements,
        responsibilities: analysis.responsibilities,
        keywords: analysis.keywords,
      },
    });
  } catch (error) {
    console.error('Job scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape job posting. Please paste the job description manually.',
    });
  }
};

// Parse pasted job description
export const parseJobDescription = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || content.length < 50) {
      return res.status(400).json({ 
        error: 'Please provide a complete job description (at least 50 characters)' 
      });
    }

    const parsed = jobScraperService.parseJobDescription(content);

    // Analyze with AI
    const analysis = await aiService.analyzeJobDescription(content);

    res.json({
      job: {
        ...parsed,
        title: analysis.title || parsed.title,
        company: analysis.company || parsed.company,
      },
      analysis: {
        requirements: analysis.requirements,
        responsibilities: analysis.responsibilities,
        keywords: analysis.keywords,
      },
    });
  } catch (error) {
    console.error('Job parsing error:', error);
    res.status(500).json({ error: 'Failed to parse job description' });
  }
};

// Get templates
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const templates = await prisma.template.findMany({
      where: {
        active: true,
        ...(type && { type: type as any }),
      },
      orderBy: { name: 'asc' },
    });

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
};

// Get single template
export const getTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to get template' });
  }
};
