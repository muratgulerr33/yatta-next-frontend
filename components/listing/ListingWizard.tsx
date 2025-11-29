"use client";

import React, { useState } from "react";
import { Step1IdentityLocation } from "./steps/Step1IdentityLocation";
import { Step2Technical } from "./steps/Step2Technical";
import { Step3StoryPrice } from "./steps/Step3StoryPrice";
import { Step4Photos } from "./steps/Step4Photos";
import { Step5SellerReview } from "./steps/Step5SellerReview";

export type ListingFormValues = {
  // Adım 1 – Kimlik & Konum
  boat_type: string;
  brand_name: string;
  model_name: string;
  year_built: number | null;
  location_province: string;
  location_district: string;

  // Adım 2 – Teknik
  length_m: number | null;
  beam_m: number | null;
  capacity_people: number | null;
  cabin_count: number | null;
  engine_count: number | null;
  fuel_type: string;
  hull_type: string;
  license_type: string;
  country_of_registry: string;

  // Adım 3 – Hikaye & Fiyat
  title: string;
  description: string;
  price_on_request: boolean;
  price: number | null;
  currency: "TRY" | "USD" | "EUR";

  // Adım 4 – Fotoğraflar (şimdilik sadece client-side placeholder)
  photos: File[];

  // Adım 5 – Satıcı
  seller_type: "owner" | "realtor" | "broker" | "other";
  contact_phone: string;
};

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
  model_name: "",
  year_built: null,
  location_province: "",
  location_district: "",
  length_m: null,
  beam_m: null,
  capacity_people: null,
  cabin_count: null,
  engine_count: 1,
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
    // TODO: Burada backend entegrasyonu yapılacak:
    // POST http://127.0.0.1:8000/api/v1/listings/
    console.log("FINAL FORM VALUES", values);
    alert("V1: Form değerleri console'da. Backend entegrasyonu bir sonraki adımda.");
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

