export default function MesajlarPage() {
  // TODO: V1.1'de /api/v1/me/messages/threads endpoint'ine bağlanacak.
  const hasMessages = false;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Mesajlar
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Üyeler, partnerler ve admin ile yaptığın yazışmalar burada.
        </p>
      </header>

      {hasMessages ? (
        <div className="space-y-3">
          {/* TODO: Konuşma listesi + mesajlaşma ekranı */}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6 text-center">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Henüz bir mesajın yok.
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            İlan sahipleriyle veya YATTA ekibiyle mesajlaştığında burada
            görünecek.
          </p>
        </div>
      )}

      <p className="text-xs text-[var(--color-text-secondary)]">
        Güvenlik ve görünürlük kuralları (kim kimin mesajını görebilir vb.)
        V2&apos;de detaylandırılacak.
      </p>
    </section>
  );
}

