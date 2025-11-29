"use client";

import React from "react";
import type { ListingFormValues } from "../ListingWizard";

type Props = {
  values: ListingFormValues;
  onChange: (patch: Partial<ListingFormValues>) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export function Step5SellerReview({ values, onChange, onBack, onSubmit }: Props) {
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
              className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              value={values.contact_phone}
              onChange={(e) => onChange({ contact_phone: e.target.value })}
              placeholder="+90 555 123 45 67"
            />
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
          onClick={onSubmit}
          className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white"
        >
          İlanı Gönder
        </button>
      </div>
    </div>
  );
}

