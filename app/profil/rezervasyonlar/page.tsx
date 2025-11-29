export default function RezervasyonlarPage() {
  // TODO: V1.1'de /api/v1/me/bookings endpoint'ine bağlanacak.
  const hasBookings = false;

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Rezervasyonlarım
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Geçmiş ve yaklaşan rezervasyonlarını burada takip edeceksin.
        </p>
      </header>

      {hasBookings ? (
        <div className="space-y-3">
          {/* TODO: Booking kartları / tablo */}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30 p-6 text-center">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Henüz bir rezervasyonun yok.
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Tur, etkinlik veya saatlik yat rezervasyonu yaptığında burada
            listelenecek.
          </p>
        </div>
      )}
    </section>
  );
}

