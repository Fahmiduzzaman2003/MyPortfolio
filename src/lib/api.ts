const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json'
  };
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (email: string, password: string) =>
    apiRequest<{ user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  getMe: () => apiRequest<{ user: any }>('/auth/me')
};

// Profile API
export const profileApi = {
  get: () => apiRequest<any>('/profile'),
  update: (data: any) =>
    apiRequest<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};

// Education API
export const educationApi = {
  getAll: () => apiRequest<any[]>('/education'),
  create: (data: any) =>
    apiRequest<any>('/education', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string | number, data: any) =>
    apiRequest<any>(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string | number) =>
    apiRequest<any>(`/education/${id}`, { method: 'DELETE' })
};

// Skills API
export const skillsApi = {
  // Added getAll to support the SkillsSection component which expects a single fetch for the tree
  getAll: () => apiRequest<any[]>('/skills/categories'),

  getCategories: () => apiRequest<any[]>('/skills/categories'),
  
  createCategory: (data: any) =>
    apiRequest<any>('/skills/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  updateCategory: (id: string | number, data: any) =>
    apiRequest<any>(`/skills/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  deleteCategory: (id: string | number) =>
    apiRequest<any>(`/skills/categories/${id}`, { method: 'DELETE' }),
    
  create: (data: any) =>
    apiRequest<any>('/skills', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  update: (id: string | number, data: any) =>
    apiRequest<any>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  delete: (id: string | number) =>
    apiRequest<any>(`/skills/${id}`, { method: 'DELETE' })
};

// Projects API
export const projectsApi = {
  getAll: () => apiRequest<any[]>('/projects'),
  create: (data: any) =>
    apiRequest<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string | number, data: any) =>
    apiRequest<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string | number) =>
    apiRequest<any>(`/projects/${id}`, { method: 'DELETE' })
};

// Research API
export const researchApi = {
  getAll: () => apiRequest<any[]>('/research'),
  create: (data: any) => {
    console.log('researchApi.create - sending data:', data);
    return apiRequest<any>('/research', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  update: (id: string | number, data: any) => {
    console.log('researchApi.update - sending data:', data);
    return apiRequest<any>(`/research/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  delete: (id: string | number) =>
    apiRequest<any>(`/research/${id}`, { method: 'DELETE' })
};

// Achievements API
export const achievementsApi = {
  getAll: () => apiRequest<any[]>('/achievements'),
  create: (data: any) =>
    apiRequest<any>('/achievements', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string | number, data: any) =>
    apiRequest<any>(`/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string | number) =>
    apiRequest<any>(`/achievements/${id}`, { method: 'DELETE' })
};

// Messages API
export const messagesApi = {
  getAll: async () => {
    const response = await apiRequest<{ messages: any[]; pagination: any }>('/messages');
    return response.messages; // Return only the messages array
  },
  submit: (data: { name: string; email: string; message: string }) =>
    apiRequest<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  markAsRead: (id: string | number) =>
    apiRequest<any>(`/messages/${id}/read`, { method: 'PATCH' }),
  reply: (id: string | number, data: { subject: string; message: string }) =>
    apiRequest<any>(`/messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  delete: (id: string | number) =>
    apiRequest<any>(`/messages/${id}`, { method: 'DELETE' })
};

// Coding Platforms API
export const codingPlatformsApi = {
  getAll: () => apiRequest<any[]>('/coding-platforms'),
  create: (data: any) =>
    apiRequest<any>('/coding-platforms', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string | number, data: any) =>
    apiRequest<any>(`/coding-platforms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string | number) =>
    apiRequest<any>(`/coding-platforms/${id}`, { method: 'DELETE' })
};

// Co-Curricular Activities API
export const coCurricularApi = {
  getAll: () => apiRequest<any[]>('/co-curricular'),
  create: (data: any) =>
    apiRequest<any>('/co-curricular', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string | number, data: any) =>
    apiRequest<any>(`/co-curricular/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string | number) =>
    apiRequest<any>(`/co-curricular/${id}`, { method: 'DELETE' })
};

// Experience API
export const experienceApi = {
  getAll: () => apiRequest<any[]>('/experience'),
  create: (data: any) =>
    apiRequest<any>('/experience', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string | number, data: any) =>
    apiRequest<any>(`/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string | number) =>
    apiRequest<any>(`/experience/${id}`, { method: 'DELETE' })
};

// Upload API
export const uploadApi = {
  upload: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
  delete: (filename: string) =>
    apiRequest<any>(`/upload/${filename}`, { method: 'DELETE' })
};

// Coding Stats API
export const codingStatsApi = {
  getLiveStats: () => apiRequest<any[]>('/coding-stats/live'),
  getLivePlatformStats: (platform: string) => 
    apiRequest<any>(`/coding-stats/live/${platform}`)
};

// Contact Info API
export const contactInfoApi = {
  getAll: () => apiRequest<any[]>('/contact-info'),
  create: (data: any) =>
    apiRequest<any>('/contact-info', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string | number, data: any) =>
    apiRequest<any>(`/contact-info/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string | number) =>
    apiRequest<any>(`/contact-info/${id}`, { method: 'DELETE' })
};