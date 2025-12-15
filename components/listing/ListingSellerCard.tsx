"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useListingMessageAction } from "@/hooks/useListingMessageAction";

interface ListingSellerCardProps {
  sellerName: string;
  sellerSubtitle?: string;      // "Sahibinden", "Broker", "Üye" vb.
  phoneNumber?: string | null;  // ham telefon string'i
  phoneHref?: string;           // tel:+90... formatında
  ownerId?: number | null;     // İlan sahibinin user ID'si
  avatarUrl?: string | null;    // opsiyonel; API'de yoksa null
  className?: string;           // ekstra class eklemek için
}

export function ListingSellerCard({
  sellerName,
  sellerSubtitle = "Üye",
  phoneNumber,
  phoneHref,
  ownerId,
  avatarUrl,
  className = "",
}: ListingSellerCardProps) {
  const initial = sellerName?.[0]?.toUpperCase() ?? "Y";
  const { handleMessageClick } = useListingMessageAction(ownerId);

  return (
    <section
      className={`rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5 ${className}`}
    >
      {/* Satıcı başlık bölümü */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={sellerName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-[#0b1220]">
              {initial}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#0b1220]">
            {sellerName}
          </span>
          <span className="text-xs text-gray-500">{sellerSubtitle}</span>
        </div>
      </div>

      {/* Telefon bilgisi */}
      {phoneNumber && (
        <div className="mb-4 rounded-xl bg-white px-3 py-2 text-xs text-gray-600">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase tracking-wide text-gray-400">
              Telefon
            </span>
            <span className="font-medium text-[#0b1220]">
              {phoneNumber}
            </span>
          </div>
        </div>
      )}

      {/* Aksiyon butonları */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {phoneHref && (
          <a
            href={phoneHref}
            className="
              inline-flex items-center justify-center
              gap-2 rounded-xl border border-slate-200 bg-white
              px-3 h-11 text-sm font-medium text-slate-900
              shadow-sm active:scale-[0.97] transition
            "
          >
            <Phone className="h-4 w-4" />
            <span>Satıcıyı Ara</span>
          </a>
        )}

        {ownerId && (
          <button
            onClick={handleMessageClick}
            className="
              inline-flex items-center justify-center
              gap-2 rounded-xl bg-blue-600
              px-3 h-11 text-sm font-medium text-white
              shadow-sm active:scale-[0.97] transition
            "
          >
            <MessageCircle className="h-4 w-4" />
            <span>Mesaj Gönder</span>
          </button>
        )}
      </div>
    </section>
  );
}
