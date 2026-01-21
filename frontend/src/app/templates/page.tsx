'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Check, 
  Lock, 
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const templates = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, single-column design with lots of whitespace. Perfect for tech and startups.',
    thumbnail: '/api/placeholder/300/400',
    isPremium: false,
    category: 'Modern',
    colors: ['#2563eb', '#1e293b'],
  },
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Traditional two-column layout. Ideal for corporate and finance roles.',
    thumbnail: '/api/placeholder/300/400',
    isPremium: false,
    category: 'Classic',
    colors: ['#1e3a5f', '#333333'],
  },
  {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'GitHub-inspired dark theme. Perfect for developers and engineers.',
    thumbnail: '/api/placeholder/300/400',
    isPremium: false,
    category: 'Tech',
    colors: ['#10b981', '#0d1117'],
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Eye-catching design with accent colors. Great for designers and marketers.',
    thumbnail: '/api/placeholder/300/400',
    isPremium: true,
    category: 'Creative',
    colors: ['#ec4899', '#6366f1'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant and sophisticated. Best for senior and C-level professionals.',
    thumbnail: '/api/placeholder/300/400',
    isPremium: true,
    category: 'Executive',
    colors: ['#0f172a', '#b8860b'],
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Focus on publications and research. Ideal for academia and education.',
    thumbnail: '/api/placeholder/300/400',
    isPremium: true,
    category: 'Academic',
    colors: ['#7c2d12', '#1e293b'],
  },
];

const categories = ['All', 'Modern', 'Classic', 'Tech', 'Creative', 'Executive', 'Academic'];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CV Builder</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container py-16 text-center">
        <div className="inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm mb-6">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          Professional Templates
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Choose Your Perfect Template
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select from our collection of ATS-optimized, professionally designed templates. 
          Each template is customizable to match your personal brand.
        </p>
      </section>

      {/* Category Filter */}
      <section className="container pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section className="container pb-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group relative overflow-hidden transition-all hover:shadow-xl"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Lock className="h-3 w-3" />
                    Premium
                  </span>
                </div>
              )}

              {/* Template Preview */}
              <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                {/* Color Preview */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors[0]}20 0%, ${template.colors[1]}20 100%)`,
                  }}
                />
                
                {/* Placeholder Template Preview */}
                <div className="absolute inset-4 bg-white rounded-lg shadow-lg p-4 overflow-hidden">
                  <div 
                    className="h-2 w-24 rounded mb-2"
                    style={{ backgroundColor: template.colors[0] }}
                  />
                  <div className="h-1.5 w-32 bg-gray-200 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-1 w-full bg-gray-100 rounded" />
                    <div className="h-1 w-5/6 bg-gray-100 rounded" />
                    <div className="h-1 w-4/5 bg-gray-100 rounded" />
                  </div>
                  <div 
                    className="h-1.5 w-20 rounded mt-4 mb-2"
                    style={{ backgroundColor: template.colors[0] }}
                  />
                  <div className="space-y-1.5">
                    <div className="h-1 w-full bg-gray-100 rounded" />
                    <div className="h-1 w-11/12 bg-gray-100 rounded" />
                  </div>
                </div>

                {/* Hover Overlay */}
                <div 
                  className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity ${
                    hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Link href={`/builder/cv?template=${template.id}`}>
                    <Button size="sm">
                      Use Template
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{template.name}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>

                {/* Features */}
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-500" />
                    ATS-Friendly
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-500" />
                    Customizable
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your CV?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Choose a template and let our AI customize your CV for any job description. 
            Get more interviews with an ATS-optimized resume.
          </p>
          <Link href="/register">
            <Button size="lg">
              Start Building for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
