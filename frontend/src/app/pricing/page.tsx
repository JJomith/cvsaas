'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  FileText, 
  Check, 
  X,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out the platform',
    price: 0,
    credits: 3,
    icon: Sparkles,
    features: [
      { text: '3 AI generations', included: true },
      { text: 'Basic templates', included: true },
      { text: 'PDF export with watermark', included: true },
      { text: 'Email support', included: true },
      { text: 'Premium templates', included: false },
      { text: 'ATS optimization', included: false },
      { text: 'Version history', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Great for active job seekers',
    price: 9.99,
    credits: 25,
    icon: Zap,
    features: [
      { text: '25 AI generations', included: true },
      { text: 'All templates', included: true },
      { text: 'PDF export (no watermark)', included: true },
      { text: 'Email support', included: true },
      { text: 'Premium templates', included: true },
      { text: 'ATS optimization', included: true },
      { text: 'Version history', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Buy Starter Pack',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious professionals',
    price: 29.99,
    credits: 100,
    icon: Crown,
    features: [
      { text: '100 AI generations', included: true },
      { text: 'All templates', included: true },
      { text: 'PDF export (no watermark)', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Premium templates', included: true },
      { text: 'ATS optimization', included: true },
      { text: 'Version history', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Buy Pro Pack',
    popular: false,
  },
];

const faqs = [
  {
    question: 'What is a credit?',
    answer: 'A credit is used each time you generate a CV or cover letter using AI. One generation = one credit. PDF downloads are free.',
  },
  {
    question: 'Do credits expire?',
    answer: 'No, your credits never expire. Use them whenever you need to create or update your CV.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, we offer a full refund within 7 days of purchase if you haven\'t used any credits.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and PayPal through our secure Stripe payment system.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption and never share your personal information with third parties.',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'one-time' | 'monthly'>('one-time');

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
            <Link href="/templates">
              <Button variant="ghost">Templates</Button>
            </Link>
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
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Pay only for what you use. No subscriptions, no hidden fees. 
          Get started for free and upgrade when you need more.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setBillingPeriod('one-time')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'one-time' 
                ? 'bg-background shadow text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            One-time Purchase
          </button>
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingPeriod === 'monthly' 
                ? 'bg-background shadow text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly (Save 20%)
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container pb-24">
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = billingPeriod === 'monthly' && plan.price > 0 
              ? (plan.price * 0.8).toFixed(2) 
              : plan.price;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105 z-10' 
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">${displayPrice}</span>
                      {billingPeriod === 'monthly' && plan.price > 0 && (
                        <span className="text-muted-foreground">/mo</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.credits} credits
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={plan.id === 'free' ? '/register' : '/dashboard/credits'}>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Credit Usage Info */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <h2 className="text-2xl font-bold text-center mb-12">How Credits Work</h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Generate CV</h3>
              <p className="text-sm text-muted-foreground">
                Uses 1 credit to generate an AI-tailored CV based on the job description
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Cover Letter</h3>
              <p className="text-sm text-muted-foreground">
                Uses 1 credit to generate a customized cover letter
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <h3 className="font-semibold mb-2">PDF Download</h3>
              <p className="text-sm text-muted-foreground">
                Always free! Download your CV as many times as you want
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Join thousands of job seekers who have created winning CVs with our AI-powered platform.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Start Building for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
