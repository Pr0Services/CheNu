/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU V25 - API SERVICE                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ═══════════════════════════════════════════════════════════════════════════════
// BASE CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

class ApiClient {
  private baseUrl: string;
  constructor(baseUrl: string) { this.baseUrl = baseUrl; }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('chenu_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  private async handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('chenu_token');
        window.location.href = '/login';
      }
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.append(k, String(v)));
    return this.handle<T>(await fetch(url.toString(), { headers: this.getHeaders() }));
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.handle<T>(await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST', headers: this.getHeaders(), body: data ? JSON.stringify(data) : undefined
    }));
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.handle<T>(await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH', headers: this.getHeaders(), body: JSON.stringify(data)
    }));
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.handle<T>(await fetch(`${this.baseUrl}${endpoint}`, { method: 'DELETE', headers: this.getHeaders() }));
  }
}

const api = new ApiClient(API_URL);

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

export const authService = {
  login: (email: string, password: string) => api.post<{ access_token: string }>('/api/v1/auth/login', { email, password }),
  register: (email: string, password: string, fullName: string) => api.post('/api/v1/auth/register', { email, password, full_name: fullName }),
  getMe: () => api.get<{ id: string; email: string; full_name: string }>('/api/v1/auth/me'),
  logout: () => api.post('/api/v1/auth/logout'),
};

export const spacesService = {
  getAll: (type?: string) => api.get<any[]>('/api/v1/spaces', { type }),
  getOne: (id: string) => api.get<any>(`/api/v1/spaces/${id}`),
  create: (data: any) => api.post('/api/v1/spaces', data),
  update: (id: string, data: any) => api.patch(`/api/v1/spaces/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/spaces/${id}`),
  switch: (id: string) => api.post(`/api/v1/spaces/switch/${id}`),
};

export const entreprisesService = {
  getAll: () => api.get<any[]>('/api/v1/entreprises'),
  getOne: (id: string) => api.get<any>(`/api/v1/entreprises/${id}`),
  create: (data: any) => api.post('/api/v1/entreprises', data),
  update: (id: string, data: any) => api.patch(`/api/v1/entreprises/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/entreprises/${id}`),
};

export const projetsService = {
  getAll: (entrepriseId?: string) => api.get<any[]>('/api/v1/projets', { entreprise_id: entrepriseId }),
  getOne: (id: string) => api.get<any>(`/api/v1/projets/${id}`),
  create: (data: any) => api.post('/api/v1/projets', data),
  update: (id: string, data: any) => api.patch(`/api/v1/projets/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/projets/${id}`),
};

export const tasksService = {
  getAll: (projetId?: string) => api.get<any[]>('/api/v1/tasks', { projet_id: projetId }),
  getOne: (id: string) => api.get<any>(`/api/v1/tasks/${id}`),
  create: (data: any) => api.post('/api/v1/tasks', data),
  update: (id: string, data: any) => api.patch(`/api/v1/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/tasks/${id}`),
};

export const documentsService = {
  getAll: (params?: any) => api.get<any[]>('/api/v1/documents', params),
  getOne: (id: string) => api.get<any>(`/api/v1/documents/${id}`),
  delete: (id: string) => api.delete(`/api/v1/documents/${id}`),
};

export const notificationsService = {
  getAll: () => api.get<any[]>('/api/v1/notifications'),
  markAsRead: (id: string) => api.patch(`/api/v1/notifications/${id}/read`, {}),
  markAllAsRead: () => api.post('/api/v1/notifications/read-all'),
};

export const novaService = {
  chat: (message: string) => api.post<{ response: string }>('/api/nova/chat', { message }),
  getAgents: () => api.get<any[]>('/api/nova/agents'),
};

export const conformiteService = {
  ccq: { verifyCard: (num: string) => api.get(`/api/v1/conformite/ccq/verify/${num}`) },
  cnesst: { submitIncident: (data: any) => api.post('/api/v1/conformite/cnesst/incident', data) },
  rbq: { verifyLicense: (num: string) => api.get(`/api/v1/conformite/rbq/verify/${num}`) },
};

export default api;

// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

export const timelineService = {
  getEvents: (projectId?: string, limit?: number) => 
    api.get<any[]>('/api/v1/timeline', { project_id: projectId, limit }),
  getEvent: (id: string) => 
    api.get<any>(`/api/v1/timeline/${id}`),
  createEvent: (data: any) => 
    api.post('/api/v1/timeline', data),
  verifyIntegrity: () => 
    api.get<any>('/api/v1/timeline/verify/integrity'),
  exportProject: (projectId: string) => 
    api.get<Blob>(`/api/v1/timeline/export/${projectId}`),
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGENTS SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

export const agentsService = {
  getAll: () => api.get<any[]>('/api/v1/agents'),
  getOne: (id: string) => api.get<any>(`/api/v1/agents/${id}`),
  invoke: (agentId: string, input: any) => 
    api.post<any>('/api/v1/agents/invoke', { agent_id: agentId, input }),
  batch: (requests: any[]) => 
    api.post<any[]>('/api/v1/agents/batch', { requests }),
};

// ═══════════════════════════════════════════════════════════════════════════════
// MEETINGS SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

export const meetingsService = {
  getAll: () => api.get<any[]>('/api/v1/meetings'),
  getOne: (id: string) => api.get<any>(`/api/v1/meetings/${id}`),
  create: (data: any) => api.post('/api/v1/meetings', data),
  update: (id: string, data: any) => api.patch(`/api/v1/meetings/${id}`, data),
  start: (id: string) => api.post(`/api/v1/meetings/${id}/start`),
  end: (id: string) => api.post(`/api/v1/meetings/${id}/end`),
  join: (id: string) => api.post(`/api/v1/meetings/${id}/join`),
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORGANIZATIONS SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

export const organizationsService = {
  getAll: () => api.get<any[]>('/api/v1/organizations'),
  getOne: (id: string) => api.get<any>(`/api/v1/organizations/${id}`),
  create: (data: any) => api.post('/api/v1/organizations', data),
  update: (id: string, data: any) => api.patch(`/api/v1/organizations/${id}`, data),
  getMembers: (id: string) => api.get<any[]>(`/api/v1/organizations/${id}/members`),
  addMember: (id: string, data: any) => api.post(`/api/v1/organizations/${id}/members`, data),
  removeMember: (orgId: string, userId: string) => api.delete(`/api/v1/organizations/${orgId}/members/${userId}`),
};
