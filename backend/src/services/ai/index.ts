import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../../config/database';
import { AIProviderType } from '@prisma/client';

export interface AIGenerationParams {
  profile: any;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
  templateSections: any[];
  type: 'CV' | 'COVER_LETTER';
  tone?: string;
}

export interface AIGenerationResult {
  content: any;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
}

class AIService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private googleAI: GoogleGenerativeAI | null = null;

  private async getPrimaryProvider() {
    const provider = await prisma.aIProvider.findFirst({
      where: { isActive: true, isPrimary: true },
    });

    if (!provider) {
      // Fallback to any active provider
      return await prisma.aIProvider.findFirst({
        where: { isActive: true },
      });
    }

    return provider;
  }

  private async getOpenAIClient(apiKey: string): Promise<OpenAI> {
    if (!this.openai) {
      this.openai = new OpenAI({ apiKey });
    }
    return this.openai;
  }

  private async getAnthropicClient(apiKey: string): Promise<Anthropic> {
    if (!this.anthropic) {
      this.anthropic = new Anthropic({ apiKey });
    }
    return this.anthropic;
  }

  private async getGoogleAIClient(apiKey: string): Promise<GoogleGenerativeAI> {
    if (!this.googleAI) {
      this.googleAI = new GoogleGenerativeAI(apiKey);
    }
    return this.googleAI;
  }

  private buildCVPrompt(params: AIGenerationParams): string {
    const { profile, jobDescription, jobTitle, companyName, tone = 'professional' } = params;

    return `You are an expert CV/Resume writer and ATS optimization specialist. Create a tailored CV for the following candidate based on the job description.

## CANDIDATE PROFILE:
Name: ${profile.user?.name || 'Candidate'}
Headline: ${profile.headline || 'Professional'}
Summary: ${profile.summary || ''}

### Work Experience:
${profile.experiences?.map((exp: any) => `
- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
  Location: ${exp.location || 'N/A'}
  Description: ${exp.description || ''}
  Achievements: ${exp.achievements?.join(', ') || 'N/A'}
`).join('\n') || 'No experience listed'}

### Education:
${profile.education?.map((edu: any) => `
- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.endDate || 'Present'})
  GPA: ${edu.gpa || 'N/A'}
`).join('\n') || 'No education listed'}

### Skills:
${profile.skills?.map((skill: any) => `${skill.name} (${skill.level})`).join(', ') || 'No skills listed'}

### Projects:
${profile.projects?.map((proj: any) => `
- ${proj.name}: ${proj.description || ''} (Technologies: ${proj.technologies?.join(', ') || 'N/A'})
`).join('\n') || 'No projects listed'}

### Certifications:
${profile.certifications?.map((cert: any) => `- ${cert.name} by ${cert.issuer}`).join('\n') || 'No certifications'}

### Languages:
${profile.languages?.map((lang: any) => `${lang.name} (${lang.proficiency})`).join(', ') || 'English'}

## JOB DETAILS:
Title: ${jobTitle || 'Not specified'}
Company: ${companyName || 'Not specified'}

## JOB DESCRIPTION:
${jobDescription}

## INSTRUCTIONS:
1. Create a tailored CV that highlights the most relevant experience, skills, and achievements for this specific job
2. Use a ${tone} tone throughout
3. Optimize for ATS (Applicant Tracking Systems) by:
   - Including relevant keywords from the job description
   - Using standard section headers
   - Avoiding complex formatting
4. Quantify achievements where possible
5. Focus on transferable skills that match the job requirements

## REQUIRED OUTPUT FORMAT (JSON):
{
  "sections": {
    "summary": "A compelling professional summary tailored to this role (2-3 sentences)",
    "experience": [
      {
        "company": "Company Name",
        "title": "Job Title",
        "location": "Location",
        "startDate": "YYYY-MM",
        "endDate": "YYYY-MM or Present",
        "description": "Brief role description",
        "achievements": ["Achievement 1 with metrics", "Achievement 2"]
      }
    ],
    "education": [
      {
        "institution": "School Name",
        "degree": "Degree",
        "field": "Field of Study",
        "startDate": "YYYY-MM",
        "endDate": "YYYY-MM",
        "gpa": "GPA if notable"
      }
    ],
    "skills": {
      "technical": ["Skill 1", "Skill 2"],
      "soft": ["Skill 1", "Skill 2"]
    },
    "certifications": [
      {
        "name": "Certification Name",
        "issuer": "Issuing Organization",
        "date": "YYYY-MM"
      }
    ]
  },
  "atsScore": 85,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["Suggestion for improvement 1", "Suggestion 2"]
}

Return ONLY valid JSON, no additional text.`;
  }

  private buildCoverLetterPrompt(params: AIGenerationParams): string {
    const { profile, jobDescription, jobTitle, companyName, tone = 'professional' } = params;

    return `You are an expert cover letter writer. Create a compelling, personalized cover letter for the following candidate.

## CANDIDATE PROFILE:
Name: ${profile.user?.name || 'Candidate'}
Headline: ${profile.headline || 'Professional'}
Current Role: ${profile.experiences?.[0]?.title || 'Professional'}
Current Company: ${profile.experiences?.[0]?.company || ''}
Summary: ${profile.summary || ''}

### Key Experience:
${profile.experiences?.slice(0, 2).map((exp: any) => `
- ${exp.title} at ${exp.company}
  Key achievements: ${exp.achievements?.slice(0, 2).join(', ') || 'Various accomplishments'}
`).join('\n') || 'Experienced professional'}

### Top Skills:
${profile.skills?.slice(0, 8).map((skill: any) => skill.name).join(', ') || 'Various skills'}

## JOB DETAILS:
Title: ${jobTitle || 'The position'}
Company: ${companyName || 'Your company'}

## JOB DESCRIPTION:
${jobDescription}

## INSTRUCTIONS:
1. Write a compelling cover letter (3-4 paragraphs)
2. Use a ${tone} tone
3. Address specific requirements from the job description
4. Highlight relevant achievements and skills
5. Show enthusiasm for the role and company
6. Include a clear call to action

## REQUIRED OUTPUT FORMAT (JSON):
{
  "sections": {
    "greeting": "Dear Hiring Manager,",
    "opening": "First paragraph - Hook and position interest",
    "body": "Second/third paragraph - Relevant experience and achievements",
    "closing": "Final paragraph - Call to action and closing",
    "signature": "Sincerely,\\n[Name]"
  },
  "atsScore": 80,
  "keywords": ["keyword1", "keyword2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}

Return ONLY valid JSON, no additional text.`;
  }

  async generateContent(params: AIGenerationParams): Promise<AIGenerationResult> {
    const provider = await this.getPrimaryProvider();

    if (!provider) {
      throw new Error('No AI provider configured. Please configure an AI provider in admin settings.');
    }

    const prompt = params.type === 'CV' 
      ? this.buildCVPrompt(params) 
      : this.buildCoverLetterPrompt(params);

    let result: string;

    switch (provider.type) {
      case 'OPENAI':
        result = await this.generateWithOpenAI(provider.apiKey, provider.model, prompt);
        break;
      case 'ANTHROPIC':
        result = await this.generateWithAnthropic(provider.apiKey, provider.model, prompt);
        break;
      case 'GOOGLE':
        result = await this.generateWithGoogle(provider.apiKey, provider.model, prompt);
        break;
      default:
        throw new Error(`Unsupported AI provider type: ${provider.type}`);
    }

    try {
      // Parse the JSON response
      const parsed = JSON.parse(result);
      return {
        content: parsed.sections,
        atsScore: parsed.atsScore || 75,
        keywords: parsed.keywords || [],
        suggestions: parsed.suggestions || [],
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', result);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }

  private async generateWithOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
    const client = await this.getOpenAIClient(apiKey);
    
    const response = await client.chat.completions.create({
      model: model || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional CV and cover letter writer. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content || '';
  }

  private async generateWithAnthropic(apiKey: string, model: string, prompt: string): Promise<string> {
    const client = await this.getAnthropicClient(apiKey);
    
    const response = await client.messages.create({
      model: model || 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    return textContent?.type === 'text' ? textContent.text : '';
  }

  private async generateWithGoogle(apiKey: string, model: string, prompt: string): Promise<string> {
    const client = await this.getGoogleAIClient(apiKey);
    const genModel = client.getGenerativeModel({ model: model || 'gemini-pro' });
    
    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async analyzeJobDescription(jobDescription: string): Promise<{
    title: string;
    company: string;
    requirements: string[];
    responsibilities: string[];
    keywords: string[];
  }> {
    const provider = await this.getPrimaryProvider();

    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Analyze this job description and extract key information.

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with:
{
  "title": "Job title",
  "company": "Company name if found",
  "requirements": ["Requirement 1", "Requirement 2"],
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Return ONLY valid JSON.`;

    let result: string;

    switch (provider.type) {
      case 'OPENAI':
        result = await this.generateWithOpenAI(provider.apiKey, provider.model, prompt);
        break;
      case 'ANTHROPIC':
        result = await this.generateWithAnthropic(provider.apiKey, provider.model, prompt);
        break;
      case 'GOOGLE':
        result = await this.generateWithGoogle(provider.apiKey, provider.model, prompt);
        break;
      default:
        throw new Error(`Unsupported AI provider type: ${provider.type}`);
    }

    try {
      return JSON.parse(result);
    } catch {
      return {
        title: '',
        company: '',
        requirements: [],
        responsibilities: [],
        keywords: [],
      };
    }
  }

  async calculateATSScore(cvContent: any, jobDescription: string): Promise<{
    score: number;
    feedback: string[];
  }> {
    const provider = await this.getPrimaryProvider();

    if (!provider) {
      return { score: 0, feedback: ['No AI provider configured'] };
    }

    const prompt = `Analyze this CV content against the job description and provide an ATS compatibility score.

CV CONTENT:
${JSON.stringify(cvContent, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Score the CV from 0-100 based on:
1. Keyword matching (40%)
2. Skills alignment (30%)
3. Experience relevance (20%)
4. Format/structure (10%)

Return JSON:
{
  "score": 85,
  "feedback": [
    "Strength: Good keyword matching for 'React' and 'TypeScript'",
    "Improvement: Add more quantifiable achievements",
    "Missing: The job requires 'AWS' experience"
  ]
}

Return ONLY valid JSON.`;

    let result: string;

    try {
      switch (provider.type) {
        case 'OPENAI':
          result = await this.generateWithOpenAI(provider.apiKey, provider.model, prompt);
          break;
        case 'ANTHROPIC':
          result = await this.generateWithAnthropic(provider.apiKey, provider.model, prompt);
          break;
        case 'GOOGLE':
          result = await this.generateWithGoogle(provider.apiKey, provider.model, prompt);
          break;
        default:
          return { score: 0, feedback: ['Unsupported AI provider'] };
      }

      return JSON.parse(result);
    } catch {
      return { score: 70, feedback: ['Unable to analyze ATS score'] };
    }
  }
}

export const aiService = new AIService();
export default aiService;
