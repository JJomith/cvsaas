import { z } from 'zod';

// Auth Validations
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Profile Validations
export const profileSchema = z.object({
  headline: z.string().max(200).optional().nullable(),
  summary: z.string().max(2000).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal('')),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal('')),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(100),
  title: z.string().min(1, 'Title is required').max(100),
  location: z.string().max(100).optional().nullable(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().max(2000).optional().nullable(),
  achievements: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(100),
  degree: z.string().min(1, 'Degree is required').max(100),
  field: z.string().min(1, 'Field is required').max(100),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  gpa: z.string().max(10).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
});

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(50),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  category: z.string().max(50).optional().nullable(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(2000).optional().nullable(),
  url: z.string().url().optional().nullable().or(z.literal('')),
  startDate: z.string().or(z.date()).optional().nullable(),
  endDate: z.string().or(z.date()).optional().nullable(),
  technologies: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
});

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(100),
  issuer: z.string().min(1, 'Issuer is required').max(100),
  issueDate: z.string().or(z.date()),
  expiryDate: z.string().or(z.date()).optional().nullable(),
  credentialId: z.string().max(100).optional().nullable(),
  url: z.string().url().optional().nullable().or(z.literal('')),
});

// Document Validations
export const documentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  type: z.enum(['cv', 'cover_letter']),
  templateId: z.string().optional().nullable(),
  content: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
});

// Job Validations
export const jobDescriptionSchema = z.object({
  description: z.string().min(10, 'Job description is required'),
  url: z.string().url().optional().nullable(),
  company: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
});

// AI Generation Validations
export const generateCVSchema = z.object({
  profileId: z.string().optional(),
  jobDescription: z.string().min(10, 'Job description is required'),
  templateId: z.string().optional(),
  targetRole: z.string().optional(),
  tone: z.enum(['professional', 'creative', 'technical', 'executive']).optional(),
});

export const generateCoverLetterSchema = z.object({
  cvId: z.string().optional(),
  profileId: z.string().optional(),
  jobDescription: z.string().min(10, 'Job description is required'),
  company: z.string().optional(),
  hiringManager: z.string().optional(),
  tone: z.enum(['formal', 'friendly', 'enthusiastic', 'professional']).optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type JobDescriptionInput = z.infer<typeof jobDescriptionSchema>;
export type GenerateCVInput = z.infer<typeof generateCVSchema>;
export type GenerateCoverLetterInput = z.infer<typeof generateCoverLetterSchema>;
