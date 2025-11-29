const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yatta.com.tr';

export interface RegisterData {
  email: string;
  password: string;
  phone?: string;
  city?: string;
  district?: string;
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
      body: JSON.stringify(data),
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
      body: JSON.stringify(data),
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

export async function getMe(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/accounts/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie'leri gönder
    });

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

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/v1/accounts/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

