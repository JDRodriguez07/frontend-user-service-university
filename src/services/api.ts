// API client configuration and endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1123';

// Token management
export const tokenManager = {
  getToken: (): string | null => localStorage.getItem('jwt_token'),
  setToken: (token: string): void => localStorage.setItem('jwt_token', token),
  removeToken: (): void => localStorage.removeItem('jwt_token'),
};

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: number;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: 'ADMIN' | 'STUDENT' | 'TEACHER';
}

export interface Student {
  id: number;
  studentCode: string;
  dni: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  status: string;
  role: string;
  career: string;
  admissionDate: string;
  graduationDate: string | null;
  gpa: number;
  studentStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  id: number;
  teacherCode: string;
  dni: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  status: string;
  role: string;
  specialization: string;
  academicDegree: string;
  contractType: string;
  hireDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Administrator {
  id: number;
  adminCode: string;
  dni: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  status: string;
  role: string;
  department: string;
  position: string;
}

export interface CreateStudentRequest {
  documentType: string;
  dni: string;
  name: string;
  lastName: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  career: string;
  admissionDate: string;
  graduationDate?: string | null;
  gpa: number;
  studentStatus: string;
}

export interface CreateTeacherRequest {
  documentType: string;
  dni: string;
  name: string;
  lastName: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  specialization: string;
  academicDegree: string;
  contractType: string;
  hireDate: string;
}

export interface CreateAdministratorRequest {
  documentType: string;
  dni: string;
  name: string;
  lastName: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  department: string;
  position: string;
}

// API Error class
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Base fetch wrapper with auth
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = tokenManager.getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    tokenManager.removeToken();
    window.location.href = '/auth/login';
    throw new APIError(response.status, 'Unauthorized');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new APIError(response.status, errorText || response.statusText);
  }

  return response;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new APIError(response.status, 'Invalid credentials');
    }

    return response.json();
  },
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    const response = await fetchWithAuth('/users');
    return response.json();
  },

  getById: async (id: number): Promise<User> => {
    const response = await fetchWithAuth(`/users/${id}`);
    return response.json();
  },

  create: async (data: { email: string; password: string; role: string }): Promise<User> => {
    const response = await fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: number, data: Partial<User> & { password?: string }): Promise<User> => {
    const response = await fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`/users/${id}`, { method: 'DELETE' });
  },

  search: async (value: string): Promise<any> => {
    const response = await fetchWithAuth(`/users/search?value=${encodeURIComponent(value)}`);
    return response.json();
  },
};

// Students API
export const studentsAPI = {
  getAll: async (): Promise<Student[]> => {
    const response = await fetchWithAuth('/students');
    return response.json();
  },

  getById: async (id: number): Promise<Student> => {
    const response = await fetchWithAuth(`/students/${id}`);
    return response.json();
  },

  create: async (data: CreateStudentRequest): Promise<Student> => {
    const response = await fetchWithAuth('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: number, data: Partial<CreateStudentRequest>): Promise<Student> => {
    const response = await fetchWithAuth(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`/students/${id}`, { method: 'DELETE' });
  },
};

// Teachers API
export const teachersAPI = {
  getAll: async (): Promise<Teacher[]> => {
    const response = await fetchWithAuth('/teachers');
    return response.json();
  },

  getById: async (id: number): Promise<Teacher> => {
    const response = await fetchWithAuth(`/teachers/${id}`);
    return response.json();
  },

  create: async (data: CreateTeacherRequest): Promise<Teacher> => {
    const response = await fetchWithAuth('/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: number, data: Partial<CreateTeacherRequest>): Promise<Teacher> => {
    const response = await fetchWithAuth(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`/teachers/${id}`, { method: 'DELETE' });
  },
};

// Administrators API
export const administratorsAPI = {
  getAll: async (): Promise<Administrator[]> => {
    const response = await fetchWithAuth('/administrators');
    return response.json();
  },

  getById: async (id: number): Promise<Administrator> => {
    const response = await fetchWithAuth(`/administrators/${id}`);
    return response.json();
  },

  create: async (data: CreateAdministratorRequest): Promise<Administrator> => {
    const response = await fetchWithAuth('/administrators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: number, data: Partial<CreateAdministratorRequest>): Promise<Administrator> => {
    const response = await fetchWithAuth(`/administrators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`/administrators/${id}`, { method: 'DELETE' });
  },
};
