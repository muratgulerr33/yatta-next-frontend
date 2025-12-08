"use client";

import React from "react";
import type { ListingFormValues } from "@/lib/types/listings";

type Props = {
  values: ListingFormValues;
  onChange: (patch: Partial<ListingFormValues>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step2Technical({ values, onChange, onNext, onBack }: Props) {
  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      {/* Boy, En, Kapasite, Kabin, Motor */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Boy (m) *</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.length_m ?? ""}
            onChange={(e) =>
              onChange({
                length_m: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">En (m) *</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.beam_m ?? ""}
            onChange={(e) =>
              onChange({
                beam_m: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Kapasite (kişi) *</label>
          <input
            type="number"
            inputMode="numeric"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.capacity_people ?? ""}
            onChange={(e) =>
              onChange({
                capacity_people: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Kamara sayısı</label>
          <input
            type="number"
            inputMode="numeric"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.cabin_count ?? ""}
            onChange={(e) =>
              onChange({
                cabin_count: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Motor adedi</label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.engine_count ?? 1}
            onChange={(e) =>
              onChange({
                engine_count: Number(e.target.value),
              })
            }
          >
            <option value={1}>Tek motor</option>
            <option value={2}>Çift motor</option>
          </select>
        </div>
      </div>

      {/* Motor bilgisi */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Motor bilgisi</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          value={values.engine_info_note ?? ""}
          onChange={(e) =>
            onChange({
              engine_info_note: e.target.value || null,
            })
          }
          placeholder="Örn: Twin diesel engines, 500 HP each"
          rows={3}
          maxLength={300}
        />
        <p className="mt-1 text-xs text-gray-500">
          {values.engine_info_note?.length || 0} / 300 karakter
        </p>
      </div>

      {/* Yakıt tipi, Gövde tipi */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Yakıt tipi</label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.fuel_type}
            onChange={(e) => onChange({ fuel_type: e.target.value })}
          >
            <option value="dizel">Dizel</option>
            <option value="benzin">Benzin</option>
            <option value="elektrik">Elektrik</option>
            <option value="hibrit">Hibrit</option>
            <option value="diğer">Diğer</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">Gövde tipi</label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 text-sm"
            value={values.hull_type}
            onChange={(e) => onChange({ hull_type: e.target.value })}
          >
            <option value="">Seçiniz</option>
            <option value="fiberglass">Fiberglass</option>
            <option value="aluminyum">Alüminyum</option>
            <option value="ahşap">Ahşap</option>
            <option value="çelik">Çelik</option>
            <option value="kompozit">Kompozit</option>
            <option value="diğer">Diğer</option>
          </select>
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

