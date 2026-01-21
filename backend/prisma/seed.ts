import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cvbuilder.com' },
    update: {},
    create: {
      email: 'admin@cvbuilder.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
      credits: {
        create: {
          balance: 1000,
          totalPurchased: 1000,
          totalUsed: 0,
        },
      },
      profile: {
        create: {
          headline: 'Platform Administrator',
          summary: 'Managing the CV Builder platform.',
        },
      },
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER',
      emailVerified: new Date(),
      credits: {
        create: {
          balance: 3,
          totalPurchased: 3,
          totalUsed: 0,
        },
      },
      profile: {
        create: {
          headline: 'Software Engineer',
          summary: 'Experienced software engineer with 5+ years in full-stack development.',
          location: 'San Francisco, CA',
          linkedinUrl: 'https://linkedin.com/in/testuser',
          githubUrl: 'https://github.com/testuser',
          experiences: {
            create: [
              {
                company: 'Tech Corp',
                title: 'Senior Software Engineer',
                location: 'San Francisco, CA',
                startDate: new Date('2021-01-01'),
                current: true,
                description: 'Leading development of core platform features.',
                achievements: [
                  'Led migration to microservices architecture',
                  'Reduced API response time by 40%',
                  'Mentored team of 5 junior developers',
                ],
              },
              {
                company: 'StartupXYZ',
                title: 'Software Engineer',
                location: 'New York, NY',
                startDate: new Date('2018-06-01'),
                endDate: new Date('2020-12-31'),
                current: false,
                description: 'Full-stack development for e-commerce platform.',
                achievements: [
                  'Built payment integration handling $1M+ monthly',
                  'Implemented real-time inventory system',
                ],
              },
            ],
          },
          education: {
            create: [
              {
                institution: 'Stanford University',
                degree: 'Master of Science',
                field: 'Computer Science',
                startDate: new Date('2016-09-01'),
                endDate: new Date('2018-06-01'),
                gpa: '3.8',
              },
              {
                institution: 'UC Berkeley',
                degree: 'Bachelor of Science',
                field: 'Computer Science',
                startDate: new Date('2012-09-01'),
                endDate: new Date('2016-05-01'),
                gpa: '3.7',
              },
            ],
          },
          skills: {
            create: [
              { name: 'TypeScript', level: 'EXPERT', category: 'Programming Languages' },
              { name: 'React', level: 'EXPERT', category: 'Frontend' },
              { name: 'Node.js', level: 'ADVANCED', category: 'Backend' },
              { name: 'PostgreSQL', level: 'ADVANCED', category: 'Databases' },
              { name: 'AWS', level: 'INTERMEDIATE', category: 'Cloud' },
              { name: 'Docker', level: 'INTERMEDIATE', category: 'DevOps' },
            ],
          },
          projects: {
            create: [
              {
                name: 'Open Source CLI Tool',
                description: 'A command-line tool for automating deployment workflows.',
                technologies: ['Node.js', 'TypeScript', 'Docker'],
                url: 'https://github.com/testuser/cli-tool',
              },
            ],
          },
          certifications: {
            create: [
              {
                name: 'AWS Solutions Architect',
                issuer: 'Amazon Web Services',
                issueDate: new Date('2022-03-01'),
                expiryDate: new Date('2025-03-01'),
              },
            ],
          },
          languages: {
            create: [
              { name: 'English', proficiency: 'NATIVE' },
              { name: 'Spanish', proficiency: 'CONVERSATIONAL' },
            ],
          },
        },
      },
    },
  });
  console.log('✅ Test user created:', testUser.email);

  // Create CV templates
  const templates = [
    {
      name: 'Modern Minimal',
      type: 'CV' as const,
      description: 'A clean, single-column design with lots of whitespace. Perfect for tech and startup roles.',
      thumbnail: '/templates/modern-minimal.png',
      isPremium: false,
      active: true,
      defaultSections: JSON.stringify([
        { id: 'header', type: 'header', title: 'Header', required: true, order: 1 },
        { id: 'summary', type: 'summary', title: 'Professional Summary', required: false, order: 2 },
        { id: 'experience', type: 'experience', title: 'Work Experience', required: true, order: 3 },
        { id: 'education', type: 'education', title: 'Education', required: true, order: 4 },
        { id: 'skills', type: 'skills', title: 'Skills', required: false, order: 5 },
        { id: 'projects', type: 'projects', title: 'Projects', required: false, order: 6 },
      ]),
      styles: JSON.stringify({
        layout: 'single-column',
        colorScheme: ['#2563eb', '#1e293b', '#64748b'],
        fonts: ['Inter', 'system-ui'],
      }),
    },
    {
      name: 'Professional Classic',
      type: 'CV' as const,
      description: 'Traditional two-column layout. Ideal for corporate and finance positions.',
      thumbnail: '/templates/professional-classic.png',
      isPremium: false,
      active: true,
      defaultSections: JSON.stringify([
        { id: 'header', type: 'header', title: 'Header', required: true, order: 1 },
        { id: 'summary', type: 'summary', title: 'Profile', required: false, order: 2 },
        { id: 'experience', type: 'experience', title: 'Professional Experience', required: true, order: 3 },
        { id: 'education', type: 'education', title: 'Education', required: true, order: 4 },
        { id: 'skills', type: 'skills', title: 'Core Competencies', required: false, order: 5 },
        { id: 'certifications', type: 'certifications', title: 'Certifications', required: false, order: 6 },
      ]),
      styles: JSON.stringify({
        layout: 'two-column',
        colorScheme: ['#1e40af', '#111827', '#6b7280'],
        fonts: ['Roboto', 'Arial'],
      }),
    },
    {
      name: 'Creative Bold',
      type: 'CV' as const,
      description: 'Eye-catching design with accent colors and unique layout. Great for design and marketing roles.',
      thumbnail: '/templates/creative-bold.png',
      isPremium: true,
      active: true,
      defaultSections: JSON.stringify([
        { id: 'header', type: 'header', title: 'Header', required: true, order: 1 },
        { id: 'summary', type: 'summary', title: 'About Me', required: false, order: 2 },
        { id: 'experience', type: 'experience', title: 'Experience', required: true, order: 3 },
        { id: 'skills', type: 'skills', title: 'Expertise', required: false, order: 4 },
        { id: 'projects', type: 'projects', title: 'Portfolio', required: false, order: 5 },
        { id: 'education', type: 'education', title: 'Education', required: true, order: 6 },
      ]),
      styles: JSON.stringify({
        layout: 'creative',
        colorScheme: ['#7c3aed', '#ec4899', '#1e293b'],
        fonts: ['Poppins', 'system-ui'],
      }),
    },
    {
      name: 'Tech Focused',
      type: 'CV' as const,
      description: 'GitHub-inspired design with skill badges and project highlights. Perfect for developers.',
      thumbnail: '/templates/tech-focused.png',
      isPremium: true,
      active: true,
      defaultSections: JSON.stringify([
        { id: 'header', type: 'header', title: 'Header', required: true, order: 1 },
        { id: 'summary', type: 'summary', title: 'Summary', required: false, order: 2 },
        { id: 'skills', type: 'skills', title: 'Tech Stack', required: false, order: 3 },
        { id: 'experience', type: 'experience', title: 'Experience', required: true, order: 4 },
        { id: 'projects', type: 'projects', title: 'Projects', required: false, order: 5 },
        { id: 'education', type: 'education', title: 'Education', required: true, order: 6 },
      ]),
      styles: JSON.stringify({
        layout: 'single-column',
        colorScheme: ['#22c55e', '#0d1117', '#8b949e'],
        fonts: ['JetBrains Mono', 'monospace'],
      }),
    },
    {
      name: 'Executive',
      type: 'CV' as const,
      description: 'Elegant and sophisticated design for senior professionals and executives.',
      thumbnail: '/templates/executive.png',
      isPremium: true,
      active: true,
      defaultSections: JSON.stringify([
        { id: 'header', type: 'header', title: 'Header', required: true, order: 1 },
        { id: 'summary', type: 'summary', title: 'Executive Summary', required: false, order: 2 },
        { id: 'experience', type: 'experience', title: 'Leadership Experience', required: true, order: 3 },
        { id: 'education', type: 'education', title: 'Education', required: true, order: 4 },
        { id: 'certifications', type: 'certifications', title: 'Board Memberships & Certifications', required: false, order: 5 },
      ]),
      styles: JSON.stringify({
        layout: 'two-column',
        colorScheme: ['#0f172a', '#334155', '#94a3b8'],
        fonts: ['Playfair Display', 'Georgia'],
      }),
    },
    {
      name: 'Simple Cover Letter',
      type: 'COVER_LETTER' as const,
      description: 'Clean and professional cover letter template.',
      thumbnail: '/templates/cover-letter-simple.png',
      isPremium: false,
      active: true,
      defaultSections: JSON.stringify([
        { id: 'header', type: 'header', title: 'Header', required: true, order: 1 },
        { id: 'greeting', type: 'greeting', title: 'Greeting', required: true, order: 2 },
        { id: 'opening', type: 'paragraph', title: 'Opening Paragraph', required: true, order: 3 },
        { id: 'body', type: 'paragraph', title: 'Body', required: true, order: 4 },
        { id: 'closing', type: 'paragraph', title: 'Closing', required: true, order: 5 },
        { id: 'signature', type: 'signature', title: 'Signature', required: true, order: 6 },
      ]),
      styles: JSON.stringify({
        layout: 'single-column',
        colorScheme: ['#2563eb', '#1e293b', '#64748b'],
        fonts: ['Inter', 'system-ui'],
      }),
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, '-') },
      update: template,
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, '-'),
        ...template,
      },
    });
  }
  console.log('✅ Templates created:', templates.length);

  // Create credit packs
  const creditPacks = [
    {
      name: 'Starter Pack',
      credits: 10,
      price: 4.99,
      currency: 'USD',
      active: true,
      popular: false,
      features: ['10 AI generations', 'All templates', 'PDF export'],
    },
    {
      name: 'Pro Pack',
      credits: 25,
      price: 9.99,
      currency: 'USD',
      active: true,
      popular: true,
      features: ['25 AI generations', 'All templates', 'PDF export', 'Priority processing'],
    },
    {
      name: 'Business Pack',
      credits: 100,
      price: 29.99,
      currency: 'USD',
      active: true,
      popular: false,
      features: ['100 AI generations', 'All templates', 'PDF export', 'Priority processing', 'Version history'],
    },
  ];

  for (const pack of creditPacks) {
    await prisma.creditPack.upsert({
      where: { id: pack.name.toLowerCase().replace(/\s+/g, '-') },
      update: pack,
      create: {
        id: pack.name.toLowerCase().replace(/\s+/g, '-'),
        ...pack,
      },
    });
  }
  console.log('✅ Credit packs created:', creditPacks.length);

  // Create default AI provider (admin needs to add API key)
  await prisma.aIProvider.upsert({
    where: { id: 'default-openai' },
    update: {},
    create: {
      id: 'default-openai',
      name: 'OpenAI GPT-4',
      type: 'OPENAI',
      apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
      model: 'gpt-4-turbo-preview',
      isActive: true,
      isPrimary: true,
      costPerToken: 0.00003,
      maxTokens: 4096,
    },
  });
  console.log('✅ Default AI provider created');

  // Create system configs
  const systemConfigs = [
    { key: 'free_credits', value: '3', description: 'Initial credits for new users' },
    { key: 'cv_generation_cost', value: '1', description: 'Credits cost for CV generation' },
    { key: 'cover_letter_cost', value: '1', description: 'Credits cost for cover letter generation' },
    { key: 'ats_optimization_cost', value: '0.5', description: 'Credits cost for ATS optimization' },
    { key: 'low_credit_threshold', value: '2', description: 'Threshold for low credit warning email' },
    { key: 'max_documents_free', value: '5', description: 'Maximum documents for free users' },
    { key: 'watermark_free', value: 'true', description: 'Show watermark for free users' },
  ];

  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value, description: config.description },
      create: config,
    });
  }
  console.log('✅ System configs created:', systemConfigs.length);

  // Create sample promo code
  await prisma.promoCode.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      credits: 10,
      maxUses: 1000,
      expiresAt: new Date('2027-12-31'),
      active: true,
    },
  });
  console.log('✅ Sample promo code created: WELCOME10');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Default credentials:');
  console.log('   Admin: admin@cvbuilder.com / admin123');
  console.log('   User:  test@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
