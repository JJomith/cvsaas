'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Mail, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Download,
  Edit,
  Trash2,
  Copy,
  Eye,
  Calendar,
  Target
} from 'lucide-react';

// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    name: 'Software Engineer CV - Google',
    type: 'CV',
    templateName: 'Modern Minimal',
    jobTitle: 'Senior Software Engineer',
    company: 'Google',
    atsScore: 92,
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-20T14:45:00Z',
  },
  {
    id: '2',
    name: 'Cover Letter - Google',
    type: 'COVER_LETTER',
    templateName: 'Professional',
    jobTitle: 'Senior Software Engineer',
    company: 'Google',
    atsScore: null,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:30:00Z',
  },
  {
    id: '3',
    name: 'Product Manager CV - Meta',
    type: 'CV',
    templateName: 'Executive',
    jobTitle: 'Product Manager',
    company: 'Meta',
    atsScore: 88,
    createdAt: '2026-01-18T09:00:00Z',
    updatedAt: '2026-01-19T16:20:00Z',
  },
  {
    id: '4',
    name: 'Data Scientist CV - Netflix',
    type: 'CV',
    templateName: 'Tech Focused',
    jobTitle: 'Senior Data Scientist',
    company: 'Netflix',
    atsScore: 95,
    createdAt: '2026-01-15T14:00:00Z',
    updatedAt: '2026-01-15T18:00:00Z',
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'CV' | 'COVER_LETTER'>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAtsScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage your CVs and cover letters
          </p>
        </div>
        <Link
          href="/documents/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="CV">CVs Only</option>
            <option value="COVER_LETTER">Cover Letters Only</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              {/* Document Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${
                  doc.type === 'CV' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  {doc.type === 'CV' ? (
                    <FileText className={`h-5 w-5 ${
                      doc.type === 'CV' ? 'text-blue-600' : 'text-purple-600'
                    }`} />
                  ) : (
                    <Mail className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                
                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === doc.id ? null : doc.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  {activeDropdown === doc.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download PDF
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>
                      <hr className="my-1" />
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Info */}
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {doc.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {doc.templateName} Template
              </p>

              {/* Job Info */}
              {doc.jobTitle && (
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">{doc.jobTitle}</span>
                  {doc.company && <span> at {doc.company}</span>}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(doc.updatedAt)}
                </div>
                
                {doc.atsScore && (
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getAtsScoreColor(doc.atsScore)}`}>
                    <Target className="h-3.5 w-3.5" />
                    ATS {doc.atsScore}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first CV or cover letter to get started'}
          </p>
          {!searchQuery && filterType === 'all' && (
            <Link
              href="/documents/new"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Create your first document
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
