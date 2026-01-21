'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/lib/store';
import { documentsApi } from '@/lib/api';
import {
  FileText,
  FileEdit,
  Plus,
  Search,
  Download,
  Trash2,
  MoreHorizontal,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Document {
  id: string;
  type: 'cv' | 'cover_letter';
  title: string;
  createdAt: string;
  updatedAt: string;
  jobTitle?: string;
  company?: string;
}

export default function DocumentsPage() {
  const { token } = useAuthStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'cv' | 'cover_letter'>('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) return;
      try {
        const response = await documentsApi.list(token);
        setDocuments(response.documents as Document[]);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [token]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      doc.company?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || doc.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this document?')) return;
    try {
      await documentsApi.delete(id, token);
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleDownload = async (id: string) => {
    if (!token) return;
    try {
      const response = await documentsApi.download(id, token);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-muted-foreground">
            Manage your CVs and cover letters
          </p>
        </div>
        <Link href="/dashboard/documents/new?type=cv">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="cv">CVs</TabsTrigger>
            <TabsTrigger value="cover_letter">Cover Letters</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-32 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="group relative">
              <Link href={`/dashboard/documents/${doc.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {doc.type === 'cv' ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <FileEdit className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs">
                      {doc.type === 'cv' ? 'CV' : 'Cover Letter'}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-1 text-lg">
                    {doc.title}
                  </CardTitle>
                  {(doc.jobTitle || doc.company) && (
                    <CardDescription className="line-clamp-1">
                      {[doc.jobTitle, doc.company].filter(Boolean).join(' • ')}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(doc.createdAt)}
                  </div>
                </CardContent>
              </Link>
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(doc.id);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(doc.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No documents found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? 'Try adjusting your search or filters'
                : 'Create your first CV or cover letter to get started'}
            </p>
            {!search && (
              <Link href="/dashboard/documents/new?type=cv" className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Document
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
