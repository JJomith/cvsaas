'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore, useCreditStore } from '@/lib/store';
import { documentsApi, jobsApi } from '@/lib/api';
import {
  FileText,
  FileEdit,
  Link2,
  FileInput,
  Loader2,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

export default function NewDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();
  const { balance, deductCredits } = useCreditStore();
  const { toast } = useToast();

  const documentType = searchParams.get('type') || 'cv';
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [jobInput, setJobInput] = useState<'paste' | 'url'>('paste');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedJob, setScrapedJob] = useState<any>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!token) return;
      try {
        const response = await documentsApi.getTemplates(token);
        setTemplates(response.templates as Template[]);
        if (response.templates.length > 0) {
          setSelectedTemplate((response.templates[0] as Template).id);
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };
    fetchTemplates();
  }, [token]);

  const handleScrapeJob = async () => {
    if (!jobUrl || !token) return;
    
    setIsScraping(true);
    try {
      const response = await jobsApi.scrape(jobUrl, token);
      setScrapedJob(response.job);
      setJobDescription((response.job as any).description || '');
      setCompanyName((response.job as any).company || '');
      toast({
        title: 'Job scraped successfully!',
        description: 'The job details have been extracted.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to scrape job',
        description: error.message || 'Could not extract job details from URL.',
        variant: 'destructive',
      });
    } finally {
      setIsScraping(false);
    }
  };

  const handleGenerate = async () => {
    if (!token) return;
    
    if (balance < 1) {
      toast({
        title: 'Insufficient credits',
        description: 'Please purchase more credits to generate documents.',
        variant: 'destructive',
      });
      router.push('/dashboard/credits');
      return;
    }

    if (!jobDescription && !jobUrl) {
      toast({
        title: 'Job details required',
        description: 'Please provide a job description or URL.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (documentType === 'cv') {
        response = await documentsApi.generateCV(
          {
            templateId: selectedTemplate,
            jobDescription: jobDescription || undefined,
            jobUrl: jobUrl || undefined,
          },
          token
        );
      } else {
        response = await documentsApi.generateCoverLetter(
          {
            jobDescription: jobDescription || undefined,
            jobUrl: jobUrl || undefined,
            companyName: companyName || undefined,
            hiringManager: hiringManager || undefined,
          },
          token
        );
      }

      deductCredits(1);
      toast({
        title: 'Document generated!',
        description: `Your ${documentType === 'cv' ? 'CV' : 'cover letter'} has been created.`,
      });
      router.push(`/dashboard/documents/${(response.document as any).id}`);
    } catch (error: any) {
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create {documentType === 'cv' ? 'CV' : 'Cover Letter'}
          </h1>
          <p className="text-muted-foreground">
            Customize your {documentType === 'cv' ? 'CV' : 'cover letter'} for the job
          </p>
        </div>
      </div>

      {/* Document Type Selector */}
      <div className="flex gap-4">
        <Link href="/dashboard/documents/new?type=cv" className="flex-1">
          <Card
            className={`cursor-pointer transition-all ${
              documentType === 'cv'
                ? 'border-primary ring-2 ring-primary'
                : 'hover:border-primary/50'
            }`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">CV / Resume</p>
                <p className="text-sm text-muted-foreground">
                  Tailored to the job description
                </p>
              </div>
              {documentType === 'cv' && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/documents/new?type=cover-letter" className="flex-1">
          <Card
            className={`cursor-pointer transition-all ${
              documentType === 'cover-letter'
                ? 'border-primary ring-2 ring-primary'
                : 'hover:border-primary/50'
            }`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileEdit className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Cover Letter</p>
                <p className="text-sm text-muted-foreground">
                  Personalized introduction letter
                </p>
              </div>
              {documentType === 'cover-letter' && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Template Selection (CV only) */}
      {documentType === 'cv' && templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose a Template</CardTitle>
            <CardDescription>
              Select a template style for your CV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-muted/50 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="aspect-[3/4] rounded-md bg-muted mb-3" />
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Provide the job description to customize your document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={jobInput} onValueChange={(v) => setJobInput(v as 'paste' | 'url')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">
                <FileInput className="mr-2 h-4 w-4" />
                Paste Description
              </TabsTrigger>
              <TabsTrigger value="url">
                <Link2 className="mr-2 h-4 w-4" />
                Job URL
              </TabsTrigger>
            </TabsList>
            <TabsContent value="paste" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </TabsContent>
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job Posting URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="jobUrl"
                    type="url"
                    placeholder="https://linkedin.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleScrapeJob}
                    disabled={!jobUrl || isScraping}
                  >
                    {isScraping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Fetch'
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supports LinkedIn, Indeed, and Glassdoor URLs
                </p>
              </div>
              {scrapedJob && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="font-medium">{scrapedJob.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {scrapedJob.company} • {scrapedJob.location}
                  </p>
                </div>
              )}
              {jobDescription && jobInput === 'url' && (
                <div className="space-y-2">
                  <Label>Extracted Description</Label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Cover letter specific fields */}
          {documentType === 'cover-letter' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hiringManager">Hiring Manager (optional)</Label>
                <Input
                  id="hiringManager"
                  placeholder="Jane Smith"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          This will use 1 credit. You have {balance} credits remaining.
        </p>
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isLoading || (!jobDescription && !jobUrl)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate {documentType === 'cv' ? 'CV' : 'Cover Letter'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
