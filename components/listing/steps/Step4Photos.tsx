"use client";

import React from "react";
import type { ListingFormValues } from "../ListingWizard";

const MAX_PHOTOS = 10;

type Props = {
  values: ListingFormValues;
  onChange: (patch: Partial<ListingFormValues>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step4Photos({ values, onChange, onNext, onBack }: Props) {
  const [previewFiles, setPreviewFiles] = React.useState<File[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [objectUrls, setObjectUrls] = React.useState<Map<File, string>>(new Map());

  // Memory leak önleme: URL'leri temizle
  React.useEffect(() => {
    // Yeni URL'leri oluştur
    const newUrls = new Map<File, string>();
    previewFiles.forEach((file) => {
      newUrls.set(file, URL.createObjectURL(file));
    });

    // Önceki URL'leri temizle
    const prevUrls = objectUrls;
    prevUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setObjectUrls(newUrls);

    // Cleanup: component unmount olduğunda tüm URL'leri temizle
    return () => {
      newUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewFiles]);

  const reorderFiles = (list: File[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const files = Array.from(input.files || []);

    if (!files.length) {
      setPreviewFiles([]);
      setErrorMessage(null);
      onChange({ photos: [] });
      return;
    }

    let limitedFiles = files;

    if (files.length > MAX_PHOTOS) {
      limitedFiles = files.slice(0, MAX_PHOTOS);
      setErrorMessage(`En fazla ${MAX_PHOTOS} fotoğraf yükleyebilirsiniz. Fazla fotoğraflar otomatik olarak çıkarıldı.`);

      // FileList'i gerçekten 10 dosyaya düşür (input üzerindeki "12 dosya" yazısını düzeltmek için)
      const dataTransfer = new DataTransfer();
      limitedFiles.forEach((file) => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
    } else {
      setErrorMessage(null);
    }

    setPreviewFiles(limitedFiles);
    onChange({ photos: limitedFiles });
  };

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      {/* File Input */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Fotoğraflar</label>
        <p className="mt-1 text-xs text-gray-500">
          Not: Yatay (landscape) çekilmiş fotoğraflar ilan görünümünde daha iyi sonuç verir.
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
          onChange={handleFileChange}
        />
        <p className="mt-2 text-xs text-gray-500">
          {previewFiles.length} / {MAX_PHOTOS} fotoğraf seçildi
        </p>
        {errorMessage && (
          <p className="mt-1 text-xs text-red-500">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Thumbnail Grid */}
      {previewFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {previewFiles.map((file, index) => {
            const objectUrl = objectUrls.get(file) || "";

            const handleDragStart = () => {
              setDragIndex(index);
            };

            const handleDrop = () => {
              if (dragIndex === null || dragIndex === index) return;
              const reordered = reorderFiles(previewFiles, dragIndex, index);
              setPreviewFiles(reordered);
              onChange({ photos: reordered });
              setDragIndex(null);
            };

            const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
              event.preventDefault();
            };

            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50"
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Kapak etiketi (ilk foto) */}
                {index === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Kapak
                  </span>
                )}

                <img
                  src={objectUrl}
                  alt={file.name}
                  className="h-24 w-full object-cover"
                />
              </div>
            );
          })}
        </div>
      )}

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

