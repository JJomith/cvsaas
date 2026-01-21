// Credit costs for various actions
export const CREDIT_COSTS = {
  CV_GENERATION: 1,
  COVER_LETTER_GENERATION: 1,
  ATS_OPTIMIZATION: 0.5,
  PDF_DOWNLOAD: 0,
} as const;

// Free tier limits
export const FREE_TIER = {
  INITIAL_CREDITS: 3,
  MAX_DOCUMENTS: 5,
  WATERMARK: true,
} as const;

// Document constraints
export const DOCUMENT_LIMITS = {
  MAX_EXPERIENCES: 20,
  MAX_EDUCATION: 10,
  MAX_SKILLS: 50,
  MAX_PROJECTS: 20,
  MAX_CERTIFICATIONS: 20,
  MAX_LANGUAGES: 10,
  MAX_VERSIONS: 10,
} as const;

// Skill levels
export const SKILL_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
] as const;

// Language proficiencies
export const LANGUAGE_PROFICIENCIES = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'CONVERSATIONAL', label: 'Conversational' },
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'NATIVE', label: 'Native/Fluent' },
] as const;

// Document types
export const DOCUMENT_TYPES = [
  { value: 'CV', label: 'CV/Resume' },
  { value: 'COVER_LETTER', label: 'Cover Letter' },
] as const;

// Tone options
export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
] as const;

// AI Provider types
export const AI_PROVIDER_TYPES = [
  { value: 'OPENAI', label: 'OpenAI' },
  { value: 'ANTHROPIC', label: 'Anthropic (Claude)' },
  { value: 'GOOGLE', label: 'Google AI (Gemini)' },
  { value: 'CUSTOM', label: 'Custom Provider' },
] as const;

// Default colors for templates
export const DEFAULT_COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#0891b2',
  background: '#ffffff',
  text: '#1e293b',
} as const;

// Font options
export const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'opensans', label: 'Open Sans' },
  { value: 'lato', label: 'Lato' },
  { value: 'merriweather', label: 'Merriweather' },
  { value: 'playfair', label: 'Playfair Display' },
] as const;

// Supported job board URLs for scraping
export const SUPPORTED_JOB_BOARDS = [
  'linkedin.com',
  'indeed.com',
  'glassdoor.com',
  'monster.com',
  'ziprecruiter.com',
  'dice.com',
  'careerbuilder.com',
] as const;

// ATS score thresholds
export const ATS_SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 60,
  POOR: 0,
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// API rate limits (requests per minute)
export const RATE_LIMITS = {
  AUTH: 10,
  AI_GENERATION: 20,
  GENERAL: 100,
} as const;
