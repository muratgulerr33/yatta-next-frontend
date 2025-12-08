'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import ProfileEditForm from '@/components/profil/ProfileEditForm';

export default function ProfilPage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Yükleniyor...
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="space-y-4">
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Kullanıcı bilgisi yüklenemedi.
        </div>
      </section>
    );
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'Belirtilmemiş';
  const location = [user.city, user.district].filter(Boolean).join(', ') || 'Belirtilmemiş';

  return (
    <section className="space-y-4">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Profil Bilgileri
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ad, iletişim ve temel hesap bilgilerini burada yöneteceksin.
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsEditing(true)}
          >
            Düzenle
          </Button>
        )}
      </header>

      {isEditing ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-6">
          <ProfileEditForm onCancel={() => setIsEditing(false)} />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-4">
              <h2 className="mb-3 text-sm font-medium text-[var(--color-text-secondary)]">
                Kişisel Bilgiler
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--color-text-secondary)]">Ad Soyad</span>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {fullName}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">E-posta</span>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {user.email || 'Belirtilmemiş'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-4">
              <h2 className="mb-3 text-sm font-medium text-[var(--color-text-secondary)]">
                İletişim & Konum
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--color-text-secondary)]">
                    Telefon
                  </span>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {user.phone || 'Belirtilmemiş'}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">
                    Şehir / İlçe
                  </span>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

