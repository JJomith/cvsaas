// CV Templates Index
export { ModernMinimalTemplate } from './modern-minimal';
export { ProfessionalClassicTemplate } from './professional-classic';
export { TechFocusedTemplate } from './tech-focused';
export { CreativeBoldTemplate } from './creative-bold';
export { ExecutiveTemplate } from './executive';
export { AcademicTemplate } from './academic';

// Template metadata for gallery
export const templates = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, single-column design with lots of whitespace. Perfect for tech and startups.',
    thumbnail: '/templates/modern-minimal.png',
    isPremium: false,
    category: 'modern',
  },
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Traditional two-column layout. Ideal for corporate and finance roles.',
    thumbnail: '/templates/professional-classic.png',
    isPremium: false,
    category: 'classic',
  },
  {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'GitHub-inspired dark theme. Perfect for developers and engineers.',
    thumbnail: '/templates/tech-focused.png',
    isPremium: false,
    category: 'tech',
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Eye-catching design with accent colors. Great for designers and marketers.',
    thumbnail: '/templates/creative-bold.png',
    isPremium: true,
    category: 'creative',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant and sophisticated. Best for senior and C-level professionals.',
    thumbnail: '/templates/executive.png',
    isPremium: true,
    category: 'executive',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Focus on publications and research. Ideal for academia and education.',
    thumbnail: '/templates/academic.png',
    isPremium: true,
    category: 'academic',
  },
];

// CV Data type
export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    github?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
    category: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }>;
  languages?: Array<{
    id: string;
    name: string;
    proficiency: string;
  }>;
}
