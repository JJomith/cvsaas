'use client';

import { useState } from 'react';
import { 
  DollarSign,
  Save,
  Plus,
  Trash2,
  Percent,
  Zap,
  AlertCircle
} from 'lucide-react';

// Mock pricing data
const initialPricing = {
  creditPacks: [
    { id: '1', name: 'Starter', credits: 25, price: 9.99, active: true, popular: false },
    { id: '2', name: 'Pro', credits: 100, price: 29.99, active: true, popular: true },
    { id: '3', name: 'Business', credits: 300, price: 69.99, active: true, popular: false },
  ],
  creditCosts: {
    cvGeneration: 1,
    coverLetterGeneration: 1,
    atsOptimization: 0.5,
    pdfDownload: 0,
  },
  freeTier: {
    enabled: true,
    credits: 3,
    watermark: true,
  },
};

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState(initialPricing);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const updateCreditPack = (id: string, field: string, value: string | number | boolean) => {
    setPricing({
      ...pricing,
      creditPacks: pricing.creditPacks.map(pack =>
        pack.id === id ? { ...pack, [field]: value } : pack
      ),
    });
  };

  const addCreditPack = () => {
    const newPack = {
      id: Date.now().toString(),
      name: 'New Pack',
      credits: 50,
      price: 19.99,
      active: false,
      popular: false,
    };
    setPricing({
      ...pricing,
      creditPacks: [...pricing.creditPacks, newPack],
    });
  };

  const deleteCreditPack = (id: string) => {
    setPricing({
      ...pricing,
      creditPacks: pricing.creditPacks.filter(pack => pack.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Configuration</h1>
          <p className="text-gray-600 mt-1">
            Configure credit packs, pricing, and free tier settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Credit Packs Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Credit Packs</h2>
              <p className="text-sm text-gray-500 mt-1">
                Configure the credit packages available for purchase
              </p>
            </div>
            <button
              onClick={addCreditPack}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Add Pack
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {pricing.creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`p-4 rounded-lg border ${
                pack.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Pack Name</label>
                  <input
                    type="text"
                    value={pack.name}
                    onChange={(e) => updateCreditPack(pack.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Credits</label>
                  <input
                    type="number"
                    value={pack.credits}
                    onChange={(e) => updateCreditPack(pack.id, 'credits', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pack.price}
                    onChange={(e) => updateCreditPack(pack.id, 'price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Per Credit</label>
                  <p className="px-3 py-2 text-gray-700 font-medium">
                    ${(pack.price / pack.credits).toFixed(2)}
                  </p>
                </div>
                <div className="col-span-2 flex items-end gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pack.active}
                      onChange={(e) => updateCreditPack(pack.id, 'active', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pack.popular}
                      onChange={(e) => updateCreditPack(pack.id, 'popular', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Popular</span>
                  </label>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => deleteCreditPack(pack.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Costs Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Credit Costs per Action</h2>
          <p className="text-sm text-gray-500 mt-1">
            Set how many credits each action consumes
          </p>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">CV Generation</p>
                <p className="text-sm text-gray-500">AI-powered CV content</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={pricing.creditCosts.cvGeneration}
                onChange={(e) => setPricing({
                  ...pricing,
                  creditCosts: { ...pricing.creditCosts, cvGeneration: parseFloat(e.target.value) }
                })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">credits</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Cover Letter Generation</p>
                <p className="text-sm text-gray-500">AI-powered cover letter</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={pricing.creditCosts.coverLetterGeneration}
                onChange={(e) => setPricing({
                  ...pricing,
                  creditCosts: { ...pricing.creditCosts, coverLetterGeneration: parseFloat(e.target.value) }
                })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">credits</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Percent className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">ATS Optimization</p>
                <p className="text-sm text-gray-500">ATS score check & optimization</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={pricing.creditCosts.atsOptimization}
                onChange={(e) => setPricing({
                  ...pricing,
                  creditCosts: { ...pricing.creditCosts, atsOptimization: parseFloat(e.target.value) }
                })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">credits</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">PDF Download</p>
                <p className="text-sm text-gray-500">Export to PDF</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={pricing.creditCosts.pdfDownload}
                onChange={(e) => setPricing({
                  ...pricing,
                  creditCosts: { ...pricing.creditCosts, pdfDownload: parseFloat(e.target.value) }
                })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">credits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Free Tier Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Free Tier Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure the free tier for new users
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Free Tier</p>
              <p className="text-sm text-gray-500">Give new users free credits to try the platform</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pricing.freeTier.enabled}
                onChange={(e) => setPricing({
                  ...pricing,
                  freeTier: { ...pricing.freeTier, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {pricing.freeTier.enabled && (
            <>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Free Credits</p>
                  <p className="text-sm text-gray-500">Number of credits for new users</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={pricing.freeTier.credits}
                    onChange={(e) => setPricing({
                      ...pricing,
                      freeTier: { ...pricing.freeTier, credits: parseInt(e.target.value) }
                    })}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">credits</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Watermark on Free PDFs</p>
                  <p className="text-sm text-gray-500">Add watermark to PDFs generated with free credits</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pricing.freeTier.watermark}
                    onChange={(e) => setPricing({
                      ...pricing,
                      freeTier: { ...pricing.freeTier, watermark: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-900">Important</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Changes to pricing will only affect new purchases. Existing credit balances 
            will not be affected. Make sure to save your changes before leaving this page.
          </p>
        </div>
      </div>
    </div>
  );
}
