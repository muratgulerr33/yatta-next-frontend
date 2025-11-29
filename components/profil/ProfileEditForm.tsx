'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileEditFormProps {
  onCancel?: () => void;
}

export default function ProfileEditForm({ onCancel }: ProfileEditFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    district: user?.district || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // V2: PUT /api/v1/accounts/me/
    // Şimdilik sadece console.log ve uyarı
    console.log('Form data:', formData);
    alert('Bu özellik şu anda devre dışıdır. V2 sürümünde aktif olacaktır.');
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Input
          label="Şehir"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          placeholder="İstanbul"
        />
        <Input
          label="İlçe"
          name="district"
          type="text"
          value={formData.district}
          onChange={handleChange}
          placeholder="Kadıköy"
        />
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

      <p className="text-xs text-[var(--color-text-secondary)]">
        Bu form şu anda devre dışıdır. V2 sürümünde aktif olacaktır.
      </p>
    </form>
  );
}

