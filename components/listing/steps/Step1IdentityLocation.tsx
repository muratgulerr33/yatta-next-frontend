"use client";

import React from "react";
import type { ListingFormValues } from "@/lib/types/listings";
import { TR_CITIES } from "@/data/locations/tr-cities";

type Props = {
  values: ListingFormValues;
  onChange: (patch: Partial<ListingFormValues>) => void;
  onNext: () => void;
};

export function Step1IdentityLocation({ values, onChange, onNext }: Props) {
  const selectedCity = TR_CITIES.find(
    (c) => c.value === values.location_province
  );

  const handleBrandModelChange = (value: string) => {
    onChange({
      brand_name: value,
      model_name: value,
    });
  };

  const handleCityChange = (value: string) => {
    onChange({
      location_province: value,
      location_district: "", // İl değiştiğinde ilçe değerini temizle
    });
  };

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      {/* Tekne türü */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">
          Tekne türü *
        </label>
        <select
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          value={values.boat_type}
          onChange={(e) => onChange({ boat_type: e.target.value })}
        >
          <option value="">Seçiniz</option>
          <option value="motor-yat">Motoryat</option>
          <option value="yelkenli">Yelkenli</option>
          <option value="gulet">Gulet</option>
          <option value="katamaran">Katamaran</option>
          <option value="diğer">Diğer</option>
        </select>
      </div>

      {/* Marka & Model birleştirilmiş */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">
          Marka & Model *
        </label>
        <input
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          value={values.brand_name}
          onChange={(e) => handleBrandModelChange(e.target.value)}
          placeholder='Özel yapımsa "Özel Yapım" yazın'
        />
      </div>

      {/* Yapım yılı */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Yapım yılı *</label>
        <input
          type="number"
          inputMode="numeric"
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          value={values.year_built ?? ""}
          onChange={(e) =>
            onChange({
              year_built: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </div>

      {/* İl ve İlçe */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">İl *</label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.location_province}
            onChange={(e) => handleCityChange(e.target.value)}
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
          <label className="text-sm font-medium text-gray-800">İlçe *</label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={values.location_district}
            onChange={(e) => onChange({ location_district: e.target.value })}
            disabled={!selectedCity}
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

      {/* Ruhsat tipi ve Bayrağı */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Ruhsat tipi</label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.license_type}
            onChange={(e) => onChange({ license_type: e.target.value })}
          >
            <option value="özel">Bireysel / Özel</option>
            <option value="ticari">Ticari</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Bayrağı</label>
          <input
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.country_of_registry}
            onChange={(e) => onChange({ country_of_registry: e.target.value })}
          />
        </div>
      </div>

      {/* Buton */}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Devam et
        </button>
      </div>
    </form>
  );
}

