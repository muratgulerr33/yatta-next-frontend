"use client";

import React from "react";
import type { ListingFormValues } from "@/lib/types/listings";

type Props = {
  values: ListingFormValues;
  onChange: (patch: Partial<ListingFormValues>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export function Step5SellerReview({ values, onChange, onBack, onSubmit, isSubmitting = false }: Props) {
  const [phoneError, setPhoneError] = React.useState<string | null>(null);

  const validatePhone = (phone: string): string | null => {
    if (!phone || phone.trim().length === 0) {
      return 'Telefon numarası zorunludur';
    }
    
    // Sadece rakam, +, -, (, ), boşluk karakterlerine izin ver
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return 'Telefon numarası sadece rakam, +, -, (, ) ve boşluk karakterleri içerebilir';
    }
    
    // Sadece rakam ve + karakterlerini sayarak min uzunluk kontrolü
    const digitsOnly = phone.replace(/[\s\+\-\(\)]/g, '');
    if (digitsOnly.length < 7) {
      return 'Telefon numarası en az 7 rakam içermelidir';
    }
    
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({ contact_phone: value });
    setPhoneError(validatePhone(value));
  };

  const handleSubmit = () => {
    const error = validatePhone(values.contact_phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    onSubmit();
  };

  return (
    <div className="mt-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sol taraf - Form */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">
              Satıcı tipi *
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              value={values.seller_type}
              onChange={(e) =>
                onChange({
                  seller_type: e.target.value as
                    | "owner"
                    | "realtor"
                    | "broker"
                    | "other",
                })
              }
            >
              <option value="owner">Sahibinden</option>
              <option value="realtor">Emlakçı</option>
              <option value="broker">Broker</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">
              İletişim telefonu *
            </label>
            <input
              type="tel"
              className={`w-full rounded-lg border p-2 text-sm ${
                phoneError ? 'border-red-300' : 'border-gray-300'
              }`}
              value={values.contact_phone}
              onChange={handlePhoneChange}
              placeholder="Örn: +90 555 123 45 67"
              required
            />
            {phoneError && (
              <p className="text-xs text-red-500 mt-1">{phoneError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Format serbest, minimum 7 rakam
            </p>
          </div>
        </div>

        {/* Sağ taraf - Özet */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">İlan Özeti</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Başlık:</span>{" "}
              <span className="text-gray-600">
                {values.title || "Belirtilmemiş"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tekne:</span>{" "}
              <span className="text-gray-600">
                {values.brand_name && values.model_name
                  ? `${values.brand_name} ${values.model_name}`
                  : "Belirtilmemiş"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Yapım yılı:</span>{" "}
              <span className="text-gray-600">
                {values.year_built || "Belirtilmemiş"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Konum:</span>{" "}
              <span className="text-gray-600">
                {values.location_province && values.location_district
                  ? `${values.location_province}, ${values.location_district}`
                  : "Belirtilmemiş"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Boy:</span>{" "}
              <span className="text-gray-600">
                {values.length_m ? `${values.length_m} m` : "Belirtilmemiş"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Fiyat:</span>{" "}
              <span className="text-gray-600">
                {values.price_on_request
                  ? "Talep üzerine"
                  : values.price
                  ? `${values.price.toLocaleString("tr-TR")} ${values.currency}`
                  : "Belirtilmemiş"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Fotoğraf:</span>{" "}
              <span className="text-gray-600">
                {values.photos.length} adet
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Butonlar */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !!phoneError}
          className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'İlanı Gönder'}
        </button>
      </div>
    </div>
  );
}

