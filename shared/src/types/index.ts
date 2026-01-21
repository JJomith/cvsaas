// User Types
export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithProfile extends User {
  profile: Profile | null;
  credits: UserCredits | null;
}

// Profile Types
export interface Profile {
  id: string;
  userId: string;
  headline: string | null;
  summary: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

export interface Experience {
  id: string;
  profileId: string;
  company: string;
  title: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
  achievements: string[];
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date | null;
  gpa: string | null;
  description: string | null;
}

export interface Skill {
  id: string;
  profileId: string;
  name: string;
  level: SkillLevel;
  category: string | null;
}

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Project {
  id: string;
  profileId: string;
  name: string;
  description: string | null;
  technologies: string[];
  url: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export interface Certification {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate: Date | null;
  credentialId: string | null;
  url: string | null;
}

export interface Language {
  id: string;
  profileId: string;
  name: string;
  proficiency: LanguageProficiency;
}

export type LanguageProficiency = 'BASIC' | 'CONVERSATIONAL' | 'PROFESSIONAL' | 'NATIVE';

// Document Types
export type DocumentType = 'CV' | 'COVER_LETTER';

export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  name: string;
  templateId: string;
  content: DocumentContent;
  jobDescription: string | null;
  jobUrl: string | null;
  jobTitle: string | null;
  companyName: string | null;
  atsScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentContent {
  sections: DocumentSection[];
  customizations: DocumentCustomizations;
}

export interface DocumentSection {
  id: string;
  type: string;
  title: string;
  content: any;
  visible: boolean;
  order: number;
}

export interface DocumentCustomizations {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: DocumentContent;
  pdfUrl: string | null;
  createdAt: Date;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  type: DocumentType;
  description: string;
  thumbnail: string;
  isPremium: boolean;
  active: boolean;
  defaultSections: TemplateSection[];
  styles: TemplateStyles;
}

export interface TemplateSection {
  id: string;
  type: string;
  title: string;
  required: boolean;
  order: number;
}

export interface TemplateStyles {
  layout: 'single-column' | 'two-column' | 'creative';
  colorScheme: string[];
  fonts: string[];
}

// Credit Types
export interface UserCredits {
  id: string;
  userId: string;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  updatedAt: Date;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  active: boolean;
  popular: boolean;
  features: string[];
}

export interface CreditUsage {
  id: string;
  userId: string;
  credits: number;
  action: CreditAction;
  documentId: string | null;
  createdAt: Date;
}

export type CreditAction = 'CV_GENERATION' | 'COVER_LETTER_GENERATION' | 'ATS_OPTIMIZATION' | 'PURCHASE' | 'PROMO_CODE' | 'ADMIN_GRANT';

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentId: string;
  creditPackId: string;
  createdAt: Date;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface PromoCode {
  id: string;
  code: string;
  credits: number;
  discountPercent: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  active: boolean;
  createdAt: Date;
}

// AI Provider Types
export type AIProviderType = 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'CUSTOM';

export interface AIProvider {
  id: string;
  name: string;
  type: AIProviderType;
  apiKey: string;
  model: string;
  isActive: boolean;
  isPrimary: boolean;
  costPerToken: number;
  maxTokens: number;
  createdAt: Date;
}

export interface AIGenerationRequest {
  profile: Profile;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
  templateId: string;
  type: DocumentType;
  tone?: 'professional' | 'creative' | 'formal' | 'casual';
}

export interface AIGenerationResponse {
  content: DocumentContent;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
}

// Job Scraping Types
export interface JobDetails {
  title: string;
  company: string;
  location: string | null;
  description: string;
  requirements: string[];
  responsibilities: string[];
  keywords: string[];
  salary: string | null;
  url: string | null;
}

// System Config Types
export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  updatedAt: Date;
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  totalRevenue: number;
  documentsToday: number;
  newUsersToday: number;
  revenueToday: number;
  creditUsageToday: number;
}

export interface UsageAnalytics {
  date: string;
  cvGenerations: number;
  coverLetterGenerations: number;
  atsOptimizations: number;
  pdfDownloads: number;
}

export interface RevenueAnalytics {
  date: string;
  revenue: number;
  transactions: number;
}
