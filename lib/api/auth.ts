import { request } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string | null;
    groups: string[];
    first_name?: string;
    last_name?: string;
    phone?: string;
    city?: string;
    district?: string;
  };
  errors?: Record<string, string[]>;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/accounts/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie'leri gönder
      body: JSON.stringify({
        username: data.email,  // Backend username = email bekliyor
        email: data.email,      // Email alanını da gönder
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: result.errors || { general: [result.message || 'Kayıt başarısız'] },
      };
    }

    return result;
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      errors: { general: ['Bağlantı hatası. Lütfen tekrar deneyin.'] },
    };
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie'leri gönder
      body: JSON.stringify({
        username: data.email,  // Backend username = email bekliyor
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: result.errors || { general: [result.message || 'Giriş başarısız'] },
      };
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      errors: { general: ['Bağlantı hatası. Lütfen tekrar deneyin.'] },
    };
  }
}

export async function getMe(): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/accounts/me/`, {
      method: 'GET',
      credentials: 'include', // Cookie'leri gönder
      cache: 'no-store',
    });

    if (response.status === 401) {
      // Guest durumu: hata fırlatma, null dön
      return null;
    }

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: { general: [result.message || 'Kullanıcı bilgisi alınamadı'] },
      };
    }

    return result;
  } catch (error) {
    console.error('Get me error:', error);
    return {
      success: false,
      errors: { general: ['Bağlantı hatası. Lütfen tekrar deneyin.'] },
    };
  }
}

export async function apiLogout(): Promise<void> {
  await request('/api/v1/accounts/logout/', {
    method: 'POST',
    credentials: 'include',
  });
}

