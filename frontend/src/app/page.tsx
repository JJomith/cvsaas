import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles, Zap, Shield, Download, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CV Builder</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            AI-Powered CV Generation
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Create Perfect CVs & Cover Letters in{' '}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Seconds
            </span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Customize your CV for any job description using advanced AI. Get ATS-optimized
            documents that help you land more interviews.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Building Free
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-muted-foreground">
            Powerful features to help you create professional documents that stand out.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">AI-Powered Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Paste any job description and let AI tailor your CV to match the requirements
                perfectly. Highlight relevant skills and experience automatically.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">ATS Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get your CV past Applicant Tracking Systems with keyword optimization and
                proper formatting that recruiters&apos; software can read.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Instant PDF Download</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Download beautifully formatted PDF documents instantly. Professional templates
                that look great on any device.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Multiple Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Choose from a variety of professional templates. Modern, classic, creative
                - find the perfect style for your industry.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your data is encrypted and secure. We never share your information with
                third parties. Full control over your documents.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Job URL Scraping</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Just paste a job listing URL from LinkedIn, Indeed, or Glassdoor.
                We&apos;ll extract the details and customize your CV automatically.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Credit-Based Pricing
          </h2>
          <p className="text-muted-foreground">
            Pay only for what you use. No subscriptions required.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <div className="mt-4 text-3xl font-bold">$5</div>
              <CardDescription>10 Credits</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 10 CV generations</li>
                <li>✓ 10 cover letters</li>
                <li>✓ All templates</li>
                <li>✓ PDF downloads</li>
              </ul>
              <Button className="mt-6 w-full" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <div className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                Popular
              </div>
              <CardTitle>Professional</CardTitle>
              <div className="mt-4 text-3xl font-bold">$15</div>
              <CardDescription>50 Credits</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 50 CV generations</li>
                <li>✓ 50 cover letters</li>
                <li>✓ All templates</li>
                <li>✓ PDF downloads</li>
                <li>✓ ATS optimization</li>
              </ul>
              <Button className="mt-6 w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="mt-4 text-3xl font-bold">$40</div>
              <CardDescription>150 Credits</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 150 CV generations</li>
                <li>✓ 150 cover letters</li>
                <li>✓ All templates</li>
                <li>✓ PDF downloads</li>
                <li>✓ ATS optimization</li>
                <li>✓ Priority support</li>
              </ul>
              <Button className="mt-6 w-full" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="rounded-lg bg-primary px-6 py-16 text-center text-primary-foreground md:px-12">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
            Join thousands of job seekers who have already improved their applications
            with our AI-powered CV builder.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-bold">CV Builder</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                AI-powered CV and cover letter generator for modern job seekers.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Templates</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CV Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
