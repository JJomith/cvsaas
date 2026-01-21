const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || 'An error occurred',
      data
    );
  }

  return data;
}

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    fetchApi<{ token: string; user: unknown }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchApi<{ token: string; user: unknown }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: (token: string) =>
    fetchApi<{ user: unknown }>('/auth/me', { token }),

  verifyEmail: (verificationToken: string) =>
    fetchApi('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token: verificationToken }),
    }),

  forgotPassword: (email: string) =>
    fetchApi('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (data: { token: string; password: string }) =>
    fetchApi('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }, token: string) =>
    fetchApi('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
};

// Profile API
export const profileApi = {
  get: (token: string) =>
    fetchApi<{ profile: unknown }>('/profile', { token }),

  update: (data: unknown, token: string) =>
    fetchApi('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  importLinkedIn: (linkedInUrl: string, token: string) =>
    fetchApi('/profile/import-linkedin', {
      method: 'POST',
      body: JSON.stringify({ linkedInUrl }),
      token,
    }),

  // Experience
  addExperience: (data: unknown, token: string) =>
    fetchApi('/profile/experience', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateExperience: (id: string, data: unknown, token: string) =>
    fetchApi(`/profile/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteExperience: (id: string, token: string) =>
    fetchApi(`/profile/experience/${id}`, {
      method: 'DELETE',
      token,
    }),

  // Education
  addEducation: (data: unknown, token: string) =>
    fetchApi('/profile/education', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateEducation: (id: string, data: unknown, token: string) =>
    fetchApi(`/profile/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteEducation: (id: string, token: string) =>
    fetchApi(`/profile/education/${id}`, {
      method: 'DELETE',
      token,
    }),

  // Skills
  addSkill: (data: { name: string; level: string }, token: string) =>
    fetchApi('/profile/skill', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  deleteSkill: (id: string, token: string) =>
    fetchApi(`/profile/skill/${id}`, {
      method: 'DELETE',
      token,
    }),

  // Projects
  addProject: (data: unknown, token: string) =>
    fetchApi('/profile/project', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateProject: (id: string, data: unknown, token: string) =>
    fetchApi(`/profile/project/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteProject: (id: string, token: string) =>
    fetchApi(`/profile/project/${id}`, {
      method: 'DELETE',
      token,
    }),

  // Certifications
  addCertification: (data: unknown, token: string) =>
    fetchApi('/profile/certification', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateCertification: (id: string, data: unknown, token: string) =>
    fetchApi(`/profile/certification/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteCertification: (id: string, token: string) =>
    fetchApi(`/profile/certification/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Documents API
export const documentsApi = {
  list: (token: string) =>
    fetchApi<{ documents: unknown[] }>('/documents', { token }),

  get: (id: string, token: string) =>
    fetchApi<{ document: unknown }>(`/documents/${id}`, { token }),

  generateCV: (data: { templateId: string; jobDescription?: string; jobUrl?: string }, token: string) =>
    fetchApi<{ document: unknown }>('/documents/cv', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  generateCoverLetter: (
    data: { jobDescription?: string; jobUrl?: string; companyName?: string; hiringManager?: string },
    token: string
  ) =>
    fetchApi<{ document: unknown }>('/documents/cover-letter', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (id: string, data: unknown, token: string) =>
    fetchApi(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string) =>
    fetchApi(`/documents/${id}`, {
      method: 'DELETE',
      token,
    }),

  download: (id: string, token: string) =>
    fetch(`${API_URL}/documents/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getVersions: (id: string, token: string) =>
    fetchApi<{ versions: unknown[] }>(`/documents/${id}/versions`, { token }),

  restoreVersion: (id: string, versionId: string, token: string) =>
    fetchApi(`/documents/${id}/versions/${versionId}/restore`, {
      method: 'POST',
      token,
    }),

  optimizeATS: (id: string, token: string) =>
    fetchApi(`/documents/${id}/optimize-ats`, {
      method: 'POST',
      token,
    }),

  getTemplates: (token: string) =>
    fetchApi<{ templates: unknown[] }>('/documents/templates', { token }),
};

// Jobs API
export const jobsApi = {
  scrape: (url: string, token: string) =>
    fetchApi<{ job: unknown }>('/jobs/scrape', {
      method: 'POST',
      body: JSON.stringify({ url }),
      token,
    }),

  parse: (description: string, token: string) =>
    fetchApi<{ job: unknown }>('/jobs/parse', {
      method: 'POST',
      body: JSON.stringify({ description }),
      token,
    }),
};

// Payments API
export const paymentsApi = {
  getCredits: (token: string) =>
    fetchApi<{ balance: number }>('/payments/credits', { token }),

  getCreditHistory: (token: string) =>
    fetchApi<{ transactions: unknown[] }>('/payments/credits/history', { token }),

  createCheckout: (data: { creditPackId: string; promoCode?: string }, token: string) =>
    fetchApi<{ url: string }>('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  applyPromoCode: (code: string, token: string) =>
    fetchApi<{ discount: number; credits: number }>('/payments/promo-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
      token,
    }),
};

// Admin API
export const adminApi = {
  getDashboard: (token: string) =>
    fetchApi<{ stats: unknown }>('/admin/dashboard', { token }),

  // Users
  getUsers: (params: { page?: number; limit?: number; search?: string }, token: string) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search) query.set('search', params.search);
    return fetchApi<{ users: unknown[]; total: number }>(`/admin/users?${query}`, { token });
  },

  getUser: (id: string, token: string) =>
    fetchApi<{ user: unknown }>(`/admin/users/${id}`, { token }),

  updateUser: (id: string, data: unknown, token: string) =>
    fetchApi(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteUser: (id: string, token: string) =>
    fetchApi(`/admin/users/${id}`, {
      method: 'DELETE',
      token,
    }),

  // AI Providers
  getAIProviders: (token: string) =>
    fetchApi<{ providers: unknown[] }>('/admin/ai-providers', { token }),

  updateAIProvider: (id: string, data: unknown, token: string) =>
    fetchApi(`/admin/ai-providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  // Templates
  getTemplates: (token: string) =>
    fetchApi<{ templates: unknown[] }>('/admin/templates', { token }),

  createTemplate: (data: unknown, token: string) =>
    fetchApi('/admin/templates', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateTemplate: (id: string, data: unknown, token: string) =>
    fetchApi(`/admin/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deleteTemplate: (id: string, token: string) =>
    fetchApi(`/admin/templates/${id}`, {
      method: 'DELETE',
      token,
    }),

  // Promo Codes
  getPromoCodes: (token: string) =>
    fetchApi<{ promoCodes: unknown[] }>('/admin/promo-codes', { token }),

  createPromoCode: (data: unknown, token: string) =>
    fetchApi('/admin/promo-codes', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updatePromoCode: (id: string, data: unknown, token: string) =>
    fetchApi(`/admin/promo-codes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  deletePromoCode: (id: string, token: string) =>
    fetchApi(`/admin/promo-codes/${id}`, {
      method: 'DELETE',
      token,
    }),

  // Settings
  getSettings: (token: string) =>
    fetchApi<{ settings: unknown }>('/admin/settings', { token }),

  updateSettings: (data: unknown, token: string) =>
    fetchApi('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
};

export { ApiError };
