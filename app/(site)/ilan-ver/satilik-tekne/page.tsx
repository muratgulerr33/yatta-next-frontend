'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ListingWizard } from "@/components/listing/ListingWizard";

export default function SatilikTekneIlanVerPage() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600">Yükleniyor...</div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Satılık Tekne / Yat İlanı Ver
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Adım adım ilerleyerek tekne ilanınızı kolayca oluşturun.
        </p>

        <div className="mt-6">
          <ListingWizard />
        </div>
      </div>
    </main>
  );
}

