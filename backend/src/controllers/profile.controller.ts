import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware';

// Get profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
      include: {
        experiences: {
          orderBy: { startDate: 'desc' },
        },
        education: {
          orderBy: { startDate: 'desc' },
        },
        skills: true,
        projects: {
          orderBy: { startDate: 'desc' },
        },
        certifications: {
          orderBy: { issueDate: 'desc' },
        },
        languages: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!profile) {
      // Create profile if it doesn't exist
      const newProfile = await prisma.profile.create({
        data: {
          userId: req.user!.id,
        },
        include: {
          experiences: true,
          education: true,
          skills: true,
          projects: true,
          certifications: true,
          languages: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
      return res.json({ profile: newProfile });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Update profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { headline, summary, phone, location, website, linkedinUrl, githubUrl } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: req.user!.id },
      update: {
        headline,
        summary,
        phone,
        location,
        website,
        linkedinUrl,
        githubUrl,
      },
      create: {
        userId: req.user!.id,
        headline,
        summary,
        phone,
        location,
        website,
        linkedinUrl,
        githubUrl,
      },
    });

    res.json({ profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Import from LinkedIn (placeholder - needs LinkedIn OAuth)
export const importFromLinkedIn = async (req: AuthRequest, res: Response) => {
  try {
    // This endpoint requires LinkedIn OAuth setup
    // For now, return a message indicating the feature needs configuration
    res.status(501).json({ 
      error: 'LinkedIn import not configured',
      message: 'LinkedIn OAuth credentials need to be set up to enable this feature.'
    });
  } catch (error) {
    console.error('Import from LinkedIn error:', error);
    res.status(500).json({ error: 'Failed to import from LinkedIn' });
  }
};

// Add experience
export const addExperience = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { company, title, location, startDate, endDate, current, description, achievements } = req.body;

    const experience = await prisma.experience.create({
      data: {
        profileId: profile.id,
        company,
        title,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        description,
        achievements: achievements || [],
      },
    });

    res.status(201).json({ experience });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ error: 'Failed to add experience' });
  }
};

// Update experience
export const updateExperience = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { company, title, location, startDate, endDate, current, description, achievements } = req.body;

    // Verify ownership
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!experience || experience.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const updated = await prisma.experience.update({
      where: { id },
      data: {
        company,
        title,
        location,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        current,
        description,
        achievements,
      },
    });

    res.json({ experience: updated });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
};

// Delete experience
export const deleteExperience = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const experience = await prisma.experience.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!experience || experience.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    await prisma.experience.delete({ where: { id } });

    res.json({ message: 'Experience deleted' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
};

// Add education
export const addEducation = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { institution, degree, field, startDate, endDate, gpa, description } = req.body;

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        institution,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        gpa,
        description,
      },
    });

    res.status(201).json({ education });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ error: 'Failed to add education' });
  }
};

// Update education
export const updateEducation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { institution, degree, field, startDate, endDate, gpa, description } = req.body;

    const education = await prisma.education.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!education || education.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Education not found' });
    }

    const updated = await prisma.education.update({
      where: { id },
      data: {
        institution,
        degree,
        field,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        gpa,
        description,
      },
    });

    res.json({ education: updated });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ error: 'Failed to update education' });
  }
};

// Delete education
export const deleteEducation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const education = await prisma.education.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!education || education.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Education not found' });
    }

    await prisma.education.delete({ where: { id } });

    res.json({ message: 'Education deleted' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ error: 'Failed to delete education' });
  }
};

// Add skill
export const addSkill = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { name, level, category } = req.body;

    const skill = await prisma.skill.create({
      data: {
        profileId: profile.id,
        name,
        level,
        category,
      },
    });

    res.status(201).json({ skill });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
};

// Update skill
export const updateSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, level, category } = req.body;

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!skill || skill.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: { name, level, category },
    });

    res.json({ skill: updated });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
};

// Delete skill
export const deleteSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!skill || skill.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    await prisma.skill.delete({ where: { id } });

    res.json({ message: 'Skill deleted' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};

// Bulk add skills
export const bulkAddSkills = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { skills } = req.body;

    const created = await prisma.skill.createMany({
      data: skills.map((skill: any) => ({
        profileId: profile.id,
        name: skill.name,
        level: skill.level || 'INTERMEDIATE',
        category: skill.category,
      })),
    });

    res.status(201).json({ count: created.count });
  } catch (error) {
    console.error('Bulk add skills error:', error);
    res.status(500).json({ error: 'Failed to add skills' });
  }
};

// Add project
export const addProject = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { name, description, technologies, url, startDate, endDate } = req.body;

    const project = await prisma.project.create({
      data: {
        profileId: profile.id,
        name,
        description,
        technologies: technologies || [],
        url,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
};

// Update project
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, technologies, url, startDate, endDate } = req.body;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!project || project.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        technologies,
        url,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    res.json({ project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete project
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!project || project.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Add certification
export const addCertification = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { name, issuer, issueDate, expiryDate, credentialId, url } = req.body;

    const certification = await prisma.certification.create({
      data: {
        profileId: profile.id,
        name,
        issuer,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId,
        url,
      },
    });

    res.status(201).json({ certification });
  } catch (error) {
    console.error('Add certification error:', error);
    res.status(500).json({ error: 'Failed to add certification' });
  }
};

// Update certification
export const updateCertification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const certification = await prisma.certification.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!certification || certification.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    const updated = await prisma.certification.update({
      where: { id },
      data: req.body,
    });

    res.json({ certification: updated });
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({ error: 'Failed to update certification' });
  }
};

// Delete certification
export const deleteCertification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const certification = await prisma.certification.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!certification || certification.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    await prisma.certification.delete({ where: { id } });

    res.json({ message: 'Certification deleted' });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({ error: 'Failed to delete certification' });
  }
};

// Add language
export const addLanguage = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { name, proficiency } = req.body;

    const language = await prisma.language.create({
      data: {
        profileId: profile.id,
        name,
        proficiency,
      },
    });

    res.status(201).json({ language });
  } catch (error) {
    console.error('Add language error:', error);
    res.status(500).json({ error: 'Failed to add language' });
  }
};

// Delete language
export const deleteLanguage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const language = await prisma.language.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!language || language.profile.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Language not found' });
    }

    await prisma.language.delete({ where: { id } });

    res.json({ message: 'Language deleted' });
  } catch (error) {
    console.error('Delete language error:', error);
    res.status(500).json({ error: 'Failed to delete language' });
  }
};
