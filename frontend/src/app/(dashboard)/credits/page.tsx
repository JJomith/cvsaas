'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  Zap, 
  Check, 
  Star,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';

// Mock data
const creditPacks = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 25,
    price: 9.99,
    pricePerCredit: 0.40,
    popular: false,
    features: [
      '25 AI generations',
      'All templates',
      'No watermark',
      'PDF downloads',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 100,
    price: 29.99,
    pricePerCredit: 0.30,
    popular: true,
    features: [
      '100 AI generations',
      'All templates',
      'No watermark',
      'PDF downloads',
      'Version history',
      'Priority support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    credits: 300,
    price: 69.99,
    pricePerCredit: 0.23,
    popular: false,
    features: [
      '300 AI generations',
      'All templates',
      'No watermark',
      'PDF downloads',
      'Version history',
      'Priority support',
      'API access',
    ],
  },
];

const usageHistory = [
  { id: '1', action: 'CV Generation', credits: 1, date: '2026-01-20T14:30:00Z', document: 'Software Engineer CV' },
  { id: '2', action: 'Cover Letter Generation', credits: 1, date: '2026-01-20T11:00:00Z', document: 'Google Cover Letter' },
  { id: '3', action: 'ATS Optimization', credits: 0.5, date: '2026-01-19T16:45:00Z', document: 'Product Manager CV' },
  { id: '4', action: 'CV Generation', credits: 1, date: '2026-01-18T09:30:00Z', document: 'Data Scientist CV' },
  { id: '5', action: 'Cover Letter Generation', credits: 1, date: '2026-01-17T13:00:00Z', document: 'Meta Cover Letter' },
];

export default function CreditsPage() {
  const [currentCredits] = useState(12.5);
  const [totalUsed] = useState(37.5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Credits</h1>
        <p className="text-gray-600 mt-1">
          Purchase credits to generate AI-powered CVs and cover letters
        </p>
      </div>

      {/* Current Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-1">Current Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{currentCredits}</span>
              <span className="text-blue-200">credits</span>
            </div>
            <p className="text-blue-200 text-sm mt-2">
              Total used: {totalUsed} credits
            </p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <Zap className="h-8 w-8" />
          </div>
        </div>
        
        {currentCredits < 5 && (
          <div className="mt-4 bg-white/10 rounded-lg p-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Running low on credits! Top up to continue creating.</span>
          </div>
        )}
      </div>

      {/* Credit Usage Info */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-medium text-gray-900 mb-3">Credit Usage</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">CV Generation:</span>
            <span className="font-medium">1 credit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Cover Letter:</span>
            <span className="font-medium">1 credit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">ATS Check:</span>
            <span className="font-medium">0.5 credits</span>
          </div>
        </div>
      </div>

      {/* Credit Packs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Credits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`relative bg-white rounded-xl border-2 p-6 ${
                pack.popular 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{pack.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">${pack.price}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {pack.credits} credits · ${pack.pricePerCredit.toFixed(2)}/credit
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {pack.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                  pack.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Have a promo code?</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter promo code"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Usage History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Usage</h2>
          <Link href="/dashboard/usage-history" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usageHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.document}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    -{item.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(item.date)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
