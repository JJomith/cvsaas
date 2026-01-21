'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore, useCreditStore, useProfileStore } from '@/lib/store';
import { documentsApi, profileApi } from '@/lib/api';
import {
  FileText,
  FileEdit,
  Plus,
  ArrowRight,
  User,
  Briefcase,
  GraduationCap,
  Zap,
} from 'lucide-react';

interface Document {
  id: string;
  type: string;
  title: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const { balance } = useCreditStore();
  const { profile, setProfile, setLoading: setProfileLoading } = useProfileStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        const [profileRes, docsRes] = await Promise.all([
          profileApi.get(token),
          documentsApi.list(token),
        ]);
        setProfile(profileRes.profile as any);
        setDocuments((docsRes.documents || []) as Document[]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
        setProfileLoading(false);
      }
    };
    fetchData();
  }, [token, setProfile, setProfileLoading]);

  const profileComplete = profile && (profile.firstName || profile.headline);
  const hasExperiences = profile?.experiences && profile.experiences.length > 0;
  const hasEducation = profile?.education && profile.education.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Create professional CVs and cover letters tailored to any job.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/documents/new?type=cv">
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Create CV</p>
                <p className="text-sm text-muted-foreground">1 credit</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/documents/new?type=cover-letter">
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileEdit className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Cover Letter</p>
                <p className="text-sm text-muted-foreground">1 credit</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/profile">
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Edit Profile</p>
                <p className="text-sm text-muted-foreground">
                  {profileComplete ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/credits">
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Buy Credits</p>
                <p className="text-sm text-muted-foreground">{balance} remaining</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Profile Completion */}
      {!profileComplete && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Add your information to generate better CVs and cover letters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/dashboard/profile#personal">
                <div className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Personal Info</span>
                </div>
              </Link>
              <Link href="/dashboard/profile#experience">
                <div className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Experience</span>
                  {!hasExperiences && (
                    <span className="ml-auto text-xs text-orange-600">Missing</span>
                  )}
                </div>
              </Link>
              <Link href="/dashboard/profile#education">
                <div className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Education</span>
                  {!hasEducation && (
                    <span className="ml-auto text-xs text-orange-600">Missing</span>
                  )}
                </div>
              </Link>
            </div>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full sm:w-auto">
                Complete Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your recently created CVs and cover letters</CardDescription>
          </div>
          <Link href="/dashboard/documents">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-3">
              {documents.slice(0, 5).map((doc) => (
                <Link key={doc.id} href={`/dashboard/documents/${doc.id}`}>
                  <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {doc.type === 'cv' ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <FileEdit className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type === 'cv' ? 'CV' : 'Cover Letter'} •{' '}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No documents yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first CV or cover letter to get started
              </p>
              <Link href="/dashboard/documents/new?type=cv" className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Document
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
