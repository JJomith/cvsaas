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
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  category: z.string().max(50).optional().nullable(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().max(1000).optional().nullable(),
  technologies: z.array(z.string()).default([]),
  url: z.string().url().optional().nullable().or(z.literal('')),
  startDate: z.string().or(z.date()).optional().nullable(),
  endDate: z.string().or(z.date()).optional().nullable(),
});

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(100),
  issuer: z.string().min(1, 'Issuer is required').max(100),
  issueDate: z.string().or(z.date()),
  expiryDate: z.string().or(z.date()).optional().nullable(),
  credentialId: z.string().max(100).optional().nullable(),
  url: z.string().url().optional().nullable().or(z.literal('')),
});

export const languageSchema = z.object({
  name: z.string().min(1, 'Language is required').max(50),
  proficiency: z.enum(['BASIC', 'CONVERSATIONAL', 'PROFESSIONAL', 'NATIVE']),
});

// Document Validations
export const createDocumentSchema = z.object({
  type: z.enum(['CV', 'COVER_LETTER']),
  name: z.string().min(1, 'Name is required').max(100),
  templateId: z.string().min(1, 'Template is required'),
  jobDescription: z.string().optional().nullable(),
  jobUrl: z.string().url().optional().nullable().or(z.literal('')),
  jobTitle: z.string().max(100).optional().nullable(),
  companyName: z.string().max(100).optional().nullable(),
});

export const updateDocumentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  content: z.any().optional(),
  jobDescription: z.string().optional().nullable(),
  jobTitle: z.string().max(100).optional().nullable(),
  companyName: z.string().max(100).optional().nullable(),
});

// AI Generation Validations
export const generateCVSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  tone: z.enum(['professional', 'creative', 'formal', 'casual']).default('professional'),
});

export const generateCoverLetterSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters'),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  tone: z.enum(['professional', 'creative', 'formal', 'casual']).default('professional'),
  cvId: z.string().optional(),
});

// Job Scraping Validations
export const scrapeJobSchema = z.object({
  url: z.string().url('Invalid URL'),
});

export const parseJobSchema = z.object({
  content: z.string().min(50, 'Job description must be at least 50 characters'),
});

// Payment Validations
export const createCheckoutSchema = z.object({
  creditPackId: z.string().min(1, 'Credit pack is required'),
});

export const redeemPromoSchema = z.object({
  code: z.string().min(1, 'Promo code is required').max(50),
});

// Admin Validations
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  emailVerified: z.boolean().optional(),
});

export const grantCreditsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  credits: z.number().min(1, 'Credits must be at least 1'),
  reason: z.string().max(200).optional(),
});

export const aiProviderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  type: z.enum(['OPENAI', 'ANTHROPIC', 'GOOGLE', 'CUSTOM']),
  apiKey: z.string().min(1, 'API key is required'),
  model: z.string().min(1, 'Model is required'),
  isActive: z.boolean().default(true),
  isPrimary: z.boolean().default(false),
  costPerToken: z.number().min(0).default(0),
  maxTokens: z.number().min(100).default(4096),
});

export const creditPackSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  credits: z.number().min(1, 'Credits must be at least 1'),
  price: z.number().min(0, 'Price must be non-negative'),
  currency: z.string().default('USD'),
  active: z.boolean().default(true),
  popular: z.boolean().default(false),
  features: z.array(z.string()).default([]),
});

export const promoCodeSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20),
  credits: z.number().min(0).default(0),
  discountPercent: z.number().min(0).max(100).optional().nullable(),
  maxUses: z.number().min(1).optional().nullable(),
  expiresAt: z.string().or(z.date()).optional().nullable(),
  active: z.boolean().default(true),
});

export const templateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  type: z.enum(['CV', 'COVER_LETTER']),
  description: z.string().max(500).optional(),
  thumbnail: z.string().url().optional(),
  isPremium: z.boolean().default(false),
  active: z.boolean().default(true),
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
export type LanguageInput = z.infer<typeof languageSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type GenerateCVInput = z.infer<typeof generateCVSchema>;
export type GenerateCoverLetterInput = z.infer<typeof generateCoverLetterSchema>;
