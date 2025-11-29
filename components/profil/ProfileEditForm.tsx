'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { TR_CITIES } from '@/data/locations/tr-cities';
import { updateMe } from '@/lib/api';

interface ProfileEditFormProps {
  onCancel?: () => void;
}

export default function ProfileEditForm({ onCancel }: ProfileEditFormProps) {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    district: user?.district || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityValue = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      city: cityValue,
      district: '', // İl değiştiğinde ilçe değerini temizle
    }));
  };

  const selectedCity = TR_CITIES.find((c) => c.value === formData.city);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: {
        first_name?: string;
        last_name?: string;
        phone?: string;
        city?: string;
        district?: string;
      } = {};

      if (formData.first_name) payload.first_name = formData.first_name;
      if (formData.last_name) payload.last_name = formData.last_name;
      if (formData.phone) payload.phone = formData.phone;
      if (formData.city) payload.city = formData.city;
      if (formData.district) payload.district = formData.district;

      const result = await updateMe(payload);
      
      if (result.success) {
        // Kullanıcı bilgilerini yenile
        await refreshUser();
        // Formu kapat
        if (onCancel) {
          onCancel();
        }
      } else {
        setError('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Ad"
          name="first_name"
          type="text"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Adınız"
        />
        <Input
          label="Soyad"
          name="last_name"
          type="text"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Soyadınız"
        />
      </div>

      <Input
        label="E-posta"
        name="email"
        type="email"
        value={formData.email}
        disabled
        helperText="E-posta adresi değiştirilemez"
      />

      <Input
        label="Telefon"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+90 5XX XXX XX XX"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Şehir
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleCityChange}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">İl seçin</option>
            {TR_CITIES.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            İlçe
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            disabled={!selectedCity}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:text-[var(--color-text-secondary)]"
          >
            <option value="">İlçe seçin</option>
            {selectedCity?.districts.map((district) => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Kaydet
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            İptal
          </Button>
        )}
      </div>
    </form>
  );
}

