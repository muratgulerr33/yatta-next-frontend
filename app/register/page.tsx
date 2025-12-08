'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { register, type RegisterData } from '@/lib/api/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else {
      // Basit email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Geçerli bir e-posta adresi girin';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await register(formData);

      if (result.success && result.user) {
        // Update auth context - User interface'ine uygun hale getir
        setAuthUser({
          ...result.user,
          first_name: result.user.first_name || '',
          last_name: result.user.last_name || '',
          phone: result.user.phone || '',
          city: result.user.city || '',
          district: result.user.district || '',
        });
        // Redirect to profile
        router.push('/profil/rezervasyonlar');
      } else {
        // Handle errors
        const newErrors: Record<string, string> = {};
        if (result.errors) {
          Object.keys(result.errors).forEach(key => {
            const errorMessages = result.errors![key];
            if (Array.isArray(errorMessages) && errorMessages.length > 0) {
              newErrors[key] = errorMessages[0];
            }
          });
        }
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = 'Kayıt başarısız. Lütfen tekrar deneyin.';
        }
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Register error:', error);
      setErrors({ general: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell px-4 py-6 sm:px-6 lg:px-8 min-h-screen flex flex-col">
      <div className="max-w-md mx-auto flex-1 pb-12 sm:pb-20">
        {/* Başlık */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            Kayıt Ol
          </h1>
          <p className="text-slate-600">
            E-posta adresinizle kayıt olun, hesabınızı istediğiniz zaman profil ekranından tamamlayın.
          </p>
        </header>

        {/* Genel Hata Mesajı */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <Input
            label="E-posta"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ornek@email.com"
            autoComplete="email"
            error={errors.email}
            required
          />

          {/* Password Input */}
          <PasswordInput
            label="Şifre"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            helperText="En az 8 karakter"
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full"
          >
            Kayıt Ol
          </Button>
        </form>

        {/* Alt Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Zaten hesabın var mı?{' '}
            <Link href="/login" className="text-[#004aad] font-semibold hover:underline">
              Giriş yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

