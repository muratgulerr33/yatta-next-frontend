export default function AyarlarPage() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Hesap Ayarları
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Şifre, güvenlik ve temel hesap tercihleri burada yönetilecek.
        </p>
      </header>

      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                Şifre Değiştirme
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Hesap güvenliğiniz için şifrenizi düzenli olarak güncelleyebilirsiniz.
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              Çok yakında
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">
            Bu alan V1&apos;de sadece bilgi amaçlıdır. Çok yakında burada şifre sıfırlama, doğum tarihi, adres ve diğer hesap bilgilerini güvenle yönetebileceksin.
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2 italic">
            Güncelleme geldiğinde e-posta ile haber vereceğiz.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Hesap &amp; Gizlilik
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">
            İleride bu alan altında şu özellikler yer alacak:
          </p>
          <ul className="space-y-2 text-xs text-[var(--color-text-secondary)] list-disc list-inside">
            <li>E-posta bildirim tercihleri</li>
            <li>Görünürlük ayarları</li>
            <li>Hesap kapatma</li>
            <li>Veri indirme ve silme</li>
          </ul>
          <p className="text-xs text-[var(--color-text-secondary)] mt-4 italic">
            Güncelleme geldiğinde e-posta ile haber vereceğiz.
          </p>
        </div>
      </div>
    </section>
  );
}

