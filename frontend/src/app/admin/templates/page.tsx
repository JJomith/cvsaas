'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  isActive: boolean;
  thumbnail: string;
  uses: number;
  createdAt: string;
}

const initialTemplates: Template[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, single-column design with lots of whitespace',
    category: 'modern',
    isPremium: false,
    isActive: true,
    thumbnail: '/templates/modern-minimal.png',
    uses: 1245,
    createdAt: '2024-01-15',
  },
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Traditional two-column layout for corporate roles',
    category: 'classic',
    isPremium: false,
    isActive: true,
    thumbnail: '/templates/professional-classic.png',
    uses: 2103,
    createdAt: '2024-01-15',
  },
  {
    id: 'tech-focused',
    name: 'Tech Focused',
    description: 'Developer-friendly template with GitHub-style design',
    category: 'tech',
    isPremium: false,
    isActive: true,
    thumbnail: '/templates/tech-focused.png',
    uses: 876,
    createdAt: '2024-01-18',
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Eye-catching design with vibrant gradients',
    category: 'creative',
    isPremium: true,
    isActive: true,
    thumbnail: '/templates/creative-bold.png',
    uses: 432,
    createdAt: '2024-01-20',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior professionals',
    category: 'executive',
    isPremium: true,
    isActive: true,
    thumbnail: '/templates/executive.png',
    uses: 289,
    createdAt: '2024-01-22',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Traditional academic CV format',
    category: 'academic',
    isPremium: true,
    isActive: true,
    thumbnail: '/templates/academic.png',
    uses: 167,
    createdAt: '2024-01-25',
  },
];

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'modern', 'classic', 'tech', 'creative', 'executive', 'academic'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleActive = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const togglePremium = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isPremium: !t.isPremium } : t
    ));
  };

  const deleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              ← Back to Admin
            </Link>
            <h1 className="text-xl font-bold">Template Management</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Template
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Templates</p>
            <p className="text-3xl font-bold text-gray-900">{templates.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Active Templates</p>
            <p className="text-3xl font-bold text-green-600">
              {templates.filter(t => t.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Premium Templates</p>
            <p className="text-3xl font-bold text-purple-600">
              {templates.filter(t => t.isPremium).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Uses</p>
            <p className="text-3xl font-bold text-blue-600">
              {templates.reduce((sum, t) => sum + t.uses, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Thumbnail */}
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-4xl">📄</span>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  {template.isPremium && (
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                      Premium
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-gray-500">{template.uses.toLocaleString()} uses</span>
                  <span className="text-gray-500 capitalize">{template.category}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(template.id)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                      template.isActive
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {template.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => togglePremium(template.id)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                      template.isPremium
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {template.isPremium ? 'Free' : 'Premium'}
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No templates found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTemplate) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingTemplate ? 'Edit Template' : 'Add New Template'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  defaultValue={editingTemplate?.name || ''}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Modern Professional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  defaultValue={editingTemplate?.description || ''}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Brief description of the template..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  defaultValue={editingTemplate?.category || 'modern'}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={editingTemplate?.isPremium || false}
                  />
                  <span className="text-sm">Premium Template</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={editingTemplate?.isActive ?? true}
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Thumbnail
                </label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-gray-500">Drag and drop an image, or click to select</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTemplate(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTemplate ? 'Save Changes' : 'Add Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
