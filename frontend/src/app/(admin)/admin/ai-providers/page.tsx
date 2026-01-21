'use client';

import { useState } from 'react';
import { 
  Bot,
  Plus,
  Settings,
  Check,
  AlertCircle,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Save
} from 'lucide-react';

// Mock AI providers data
const initialProviders = [
  {
    id: '1',
    name: 'OpenAI',
    type: 'openai',
    model: 'gpt-4o',
    isActive: true,
    isPrimary: true,
    apiKey: 'sk-••••••••••••••••••••••••••••••••',
    costPerToken: 0.00003,
    maxTokens: 128000,
  },
  {
    id: '2',
    name: 'Anthropic Claude',
    type: 'anthropic',
    model: 'claude-3-sonnet',
    isActive: true,
    isPrimary: false,
    apiKey: 'sk-ant-••••••••••••••••••••••••••••',
    costPerToken: 0.000015,
    maxTokens: 200000,
  },
  {
    id: '3',
    name: 'Google Gemini',
    type: 'google',
    model: 'gemini-pro',
    isActive: false,
    isPrimary: false,
    apiKey: '',
    costPerToken: 0.00001,
    maxTokens: 32000,
  },
];

export default function AdminAIProvidersPage() {
  const [providers, setProviders] = useState(initialProviders);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);

  const handleSetPrimary = (providerId: string) => {
    setProviders(providers.map(p => ({
      ...p,
      isPrimary: p.id === providerId
    })));
  };

  const handleToggleActive = (providerId: string) => {
    setProviders(providers.map(p => 
      p.id === providerId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'openai':
        return '🤖';
      case 'anthropic':
        return '🧠';
      case 'google':
        return '✨';
      default:
        return '🔮';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Providers</h1>
          <p className="text-gray-600 mt-1">
            Configure and manage AI service providers for content generation
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Provider
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-900">How it works</h3>
          <p className="text-sm text-blue-700 mt-1">
            The primary provider will be used for all AI generation requests. If it fails, 
            the system will automatically fall back to other active providers in order.
          </p>
        </div>
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`bg-white rounded-xl border-2 p-6 transition-all ${
              provider.isPrimary 
                ? 'border-blue-500 shadow-md' 
                : provider.isActive 
                  ? 'border-gray-200' 
                  : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{getProviderIcon(provider.type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    {provider.isPrimary && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        <Star className="h-3 w-3" />
                        Primary
                      </span>
                    )}
                    {provider.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Model: {provider.model}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!provider.isPrimary && provider.isActive && (
                  <button
                    onClick={() => handleSetPrimary(provider.id)}
                    className="px-3 py-1.5 text-sm border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Set as Primary
                  </button>
                )}
                <button
                  onClick={() => handleToggleActive(provider.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    provider.isActive
                      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {provider.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => setEditingProvider(provider.id)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Provider Details */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">API Key</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm font-mono text-gray-700">
                    {showApiKey === provider.id 
                      ? provider.apiKey || 'Not configured' 
                      : provider.apiKey ? '••••••••••••••••' : 'Not configured'}
                  </code>
                  {provider.apiKey && (
                    <button
                      onClick={() => setShowApiKey(showApiKey === provider.id ? null : provider.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey === provider.id ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost per Token</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  ${provider.costPerToken.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Tokens</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {provider.maxTokens.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Provider Modal */}
      {(showAddModal || editingProvider) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingProvider ? 'Edit Provider' : 'Add New Provider'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="google">Google (Gemini)</option>
                  <option value="custom">Custom / Self-hosted</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., OpenAI GPT-4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  placeholder="e.g., gpt-4o, claude-3-sonnet"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter API key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost per Token ($)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="0.00003"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    placeholder="128000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Base URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://api.openai.com/v1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only required for custom or self-hosted providers
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProvider(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingProvider ? 'Save Changes' : 'Add Provider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
