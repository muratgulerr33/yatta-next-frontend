"use client";

import React from "react";
import type { ListingFormValues } from "../ListingWizard";

const CURRENCY_OPTIONS = [
  { value: "TRY", label: "TL" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

type Props = {
  values: ListingFormValues;
  onChange: (patch: Partial<ListingFormValues>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step3StoryPrice({ values, onChange, onNext, onBack }: Props) {
  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      {/* Başlık */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">İlan Başlığı *</label>
        <input
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          value={values.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Örn: 2020 Model Lüks Motoryat"
        />
      </div>

      {/* Açıklama */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Açıklama *</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          rows={6}
          value={values.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Teknenin özelliklerini, durumunu ve diğer önemli bilgileri detaylıca açıklayın..."
        />
      </div>

      {/* Fiyat */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Fiyat</label>
            <input
              type="number"
              inputMode="numeric"
              className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              value={values.price ?? ""}
              onChange={(e) =>
                onChange({
                  price: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="Fiyat girin"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">Para birimi</label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              value={values.currency}
              onChange={(e) =>
                onChange({
                  currency: e.target.value as "TRY" | "USD" | "EUR",
                })
              }
            >
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Butonlar */}
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
        >
          Geri
        </button>
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

