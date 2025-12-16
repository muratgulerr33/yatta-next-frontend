"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing, ListingCreatePayload, Currency } from "@/lib/api/listings";
import { useToast } from "@/lib/hooks/use-toast";
import { getCountryCode } from "@/lib/utils/country-mapping";
import { ListingFormValues, mapFormValuesToUpdatePayload } from "@/lib/types/listings";
import { Step1IdentityLocation } from "./steps/Step1IdentityLocation";
import { Step2Technical } from "./steps/Step2Technical";
import { Step3StoryPrice } from "./steps/Step3StoryPrice";
import { Step4Photos } from "./steps/Step4Photos";
import { Step5SellerReview } from "./steps/Step5SellerReview";

type StepId =
  | "identity"
  | "technical"
  | "story_price"
  | "photos"
  | "seller_review";

type StepMeta = {
  id: StepId;
  title: string;
  description: string;
};

const STEPS: StepMeta[] = [
  {
    id: "identity",
    title: "1. Bilgi",
    description: "Teknenin temel kimlik ve konum bilgilerini girin.",
  },
  {
    id: "technical",
    title: "2. Teknik",
    description: "Boy, kapasite ve motor bilgilerini doldurun.",
  },
  {
    id: "story_price",
    title: "3. Fiyat",
    description: "İlan başlığını, açıklamayı ve fiyat bilgisini girin.",
  },
  {
    id: "photos",
    title: "4. Medya",
    description: "Teknenin fotoğraflarını ekleyin.",
  },
  {
    id: "seller_review",
    title: "5. Onay",
    description: "İletişim bilgilerini girin ve ilanı gözden geçirin.",
  },
];

const DEFAULT_VALUES: ListingFormValues = {
  boat_type: "",
  brand_name: "",
  year_built: null,
  location_province: "",
  location_district: "",
  length_m: null,
  beam_m: null,
  capacity_people: null,
  cabin_count: null,
  engine_count: 1,
  engine_info_note: null,
  fuel_type: "dizel",
  hull_type: "",
  license_type: "özel",
  country_of_registry: "Türkiye",
  title: "",
  description: "",
  price_on_request: false,
  price: null,
  currency: "TRY",
  photos: [],
  seller_type: "owner",
  contact_phone: "",
};

export function ListingWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [values, setValues] = useState<ListingFormValues>(DEFAULT_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const currentStep = STEPS[currentStepIndex];

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  function goNextStep() {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }

  function goPrevStep() {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }

  function updateValues(patch: Partial<ListingFormValues>) {
    setValues((prev) => ({ ...prev, ...patch }));
  }

  async function handleSubmitFinal() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Mapper fonksiyonunu kullan, ancak create için gerekli ek alanları ekle
      const basePayload = mapFormValuesToUpdatePayload(values);
      const payload: ListingCreatePayload = {
        ...basePayload,
        category_key: 'satilik-tekneler',
        category_label: 'Satılık tekneler',
        country_code: 'TR',
        country_of_registry: getCountryCode(values.country_of_registry) || 'TR',
        // Create için zorunlu alanlar - mapper undefined döndürebilir
        year_built: basePayload.year_built ?? Number(values.year_built),
        length_m: basePayload.length_m ?? Number(values.length_m),
        capacity_people: basePayload.capacity_people ?? Number(values.capacity_people),
        cabin_count: basePayload.cabin_count ?? Number(values.cabin_count),
        engine_count: basePayload.engine_count ?? Number(values.engine_count),
      } as ListingCreatePayload;

      await createListing(payload);

      toast({
        title: 'İlanınız kaydedildi',
        description: 'İlanınız incelenmek üzere kaydedildi. Onay sonrası yayına alınacak. E-posta adresinize bilgilendirme maili gönderilmiştir.',
        variant: 'success',
      });

      // Kısa gecikmeyle ilanlar sayfasına git
      setTimeout(() => {
        router.push('/profil/ilanlar');
      }, 1000);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ??
        error?.response?.data?.non_field_errors?.[0] ??
        error?.message ??
        'İlan kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.';
      toast({
        title: 'Hata',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderStep() {
    switch (currentStep.id) {
      case "identity":
        return (
          <Step1IdentityLocation
            values={values}
            onChange={updateValues}
            onNext={goNextStep}
          />
        );
      case "technical":
        return (
          <Step2Technical
            values={values}
            onChange={updateValues}
            onNext={goNextStep}
            onBack={goPrevStep}
          />
        );
      case "story_price":
        return (
          <Step3StoryPrice
            values={values}
            onChange={updateValues}
            onNext={goNextStep}
            onBack={goPrevStep}
          />
        );
      case "photos":
        return (
          <Step4Photos
            values={values}
            onChange={updateValues}
            onNext={goNextStep}
            onBack={goPrevStep}
          />
        );
      case "seller_review":
        return (
          <Step5SellerReview
            values={values}
            onChange={updateValues}
            onBack={goPrevStep}
            onSubmit={handleSubmitFinal}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 md:p-8">
      {/* Stepper */}
      <div className="flex items-center justify-between gap-1 text-[10px] sm:gap-2 sm:text-xs">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex-1">
            <div
              className={`h-2 rounded-full ${
                index <= currentStepIndex ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
            <div className="mt-2 text-xs font-medium text-gray-700">
              <span className="block truncate">{step.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h1 className="text-xl font-semibold text-gray-900">
          {currentStep.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{currentStep.description}</p>

        <div className="mt-4">{renderStep()}</div>
      </div>
    </div>
  );
}

