'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function HesabimPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">
        Hesabım
      </h1>
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
        <div className="space-y-4">
          <Input
            label="E-posta"
            type="email"
            value={user?.email || ''}
            disabled
          />
          <Input
            label="Kullanıcı Adı"
            type="text"
            value={user?.username || ''}
            disabled
          />
          <Input
            label="Telefon"
            type="tel"
            placeholder="+90 5XX XXX XX XX"
          />
          <Input
            label="Şehir"
            type="text"
            placeholder="İstanbul"
          />
          <Input
            label="İlçe"
            type="text"
            placeholder="Kadıköy"
          />
        </div>
        <div className="pt-4">
          <Button variant="primary" size="md">
            Bilgileri Güncelle
          </Button>
        </div>
      </div>
    </div>
  );
}

