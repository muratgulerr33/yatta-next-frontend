'use client';

import { useState, useMemo } from 'react';
import { updateListing, Listing } from '@/lib/api/listings';
import { useToast } from '@/lib/hooks/use-toast';
import { TR_CITIES } from '@/data/locations/tr-cities';
import { ListingFormValues, mapListingToFormValues, mapFormValuesToUpdatePayload } from '@/lib/types/listings';

type Props = {
  listing: Listing;
  onUpdated: (listing: Listing) => void;
  onClose: () => void;
};

const CURRENCY_OPTIONS = [
  { value: "TRY", label: "TL" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

export function ListingEditDialog({ listing, onUpdated, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { toast } = useToast();

  const [formValues, setFormValues] = useState<ListingFormValues>(() => 
    mapListingToFormValues(listing)
  );

  const selectedCity = useMemo(
    () => TR_CITIES.find((c) => c.value === formValues.location_province),
    [formValues.location_province]
  );

  const handleBrandModelChange = (value: string) => {
    setFormValues(prev => ({
      ...prev,
      brand_name: value,
    }));
  };

  const handleCityChange = (value: string) => {
    setFormValues(prev => ({
      ...prev,
      location_province: value,
      location_district: "", // İl değiştiğinde ilçe değerini temizle
    }));
  };

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

  const handlePhoneChange = (value: string) => {
    setFormValues(prev => ({ ...prev, contact_phone: value }));
    setPhoneError(validatePhone(value));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Başlık kontrolü
    if (!formValues.title || formValues.title.trim().length === 0) {
      errors.title = 'Başlık zorunludur';
      isValid = false;
    }

    // Zorunlu alan kontrolü (backend serializer'daki required_fields ile uyumlu)
    if (!formValues.boat_type) {
      errors.boat_type = 'Tekne türü zorunludur';
      isValid = false;
    }
    if (!formValues.brand_name) {
      errors.brand_name = 'Marka adı zorunludur';
      isValid = false;
    }
    if (!formValues.year_built) {
      errors.year_built = 'Yapım yılı zorunludur';
      isValid = false;
    }
    if (!formValues.location_province) {
      errors.location_province = 'İl zorunludur';
      isValid = false;
    }
    if (!formValues.location_district) {
      errors.location_district = 'İlçe zorunludur';
      isValid = false;
    }
    if (!formValues.length_m) {
      errors.length_m = 'Boy (m) zorunludur';
      isValid = false;
    }
    if (!formValues.capacity_people) {
      errors.capacity_people = 'Kapasite (kişi) zorunludur';
      isValid = false;
    }
    if (!formValues.cabin_count) {
      errors.cabin_count = 'Kabin sayısı zorunludur';
      isValid = false;
    }
    if (!formValues.hull_type) {
      errors.hull_type = 'Gövde tipi zorunludur';
      isValid = false;
    }
    if (!formValues.license_type) {
      errors.license_type = 'Ruhsat tipi zorunludur';
      isValid = false;
    }
    if (!formValues.engine_count) {
      errors.engine_count = 'Motor sayısı zorunludur';
      isValid = false;
    }
    if (!formValues.fuel_type) {
      errors.fuel_type = 'Yakıt tipi zorunludur';
      isValid = false;
    }
    if (!formValues.seller_type) {
      errors.seller_type = 'Satıcı tipi zorunludur';
      isValid = false;
    }

    // Telefon validasyonu
    const phoneErr = validatePhone(formValues.contact_phone);
    if (phoneErr) {
      errors.contact_phone = phoneErr;
      isValid = false;
    }

    // Fiyat validasyonu
    if (!formValues.price_on_request) {
      if (formValues.price == null || formValues.price <= 0) {
        errors.price = "Fiyat, 0'dan büyük olmalıdır.";
        isValid = false;
      }
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (isSubmitting) return;

    // Client-side validation
    if (!validateForm()) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm zorunlu alanları doldurun.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const payload = mapFormValuesToUpdatePayload(formValues);
      const updated = await updateListing(listing.slug, payload);
      
      toast({
        title: 'İlan güncellendi',
        description: 'Değişiklikleriniz kaydedildi.',
        variant: 'success',
      });
      onUpdated(updated);
      onClose();
    } catch (error: any) {
      // Backend'den gelen field-specific error'ları parse et
      const backendErrors = error?.response?.data;
      if (backendErrors) {
        const parsedErrors: Record<string, string> = {};
        
        // Field-specific errors
        Object.keys(backendErrors).forEach((key) => {
          if (key !== 'detail' && key !== 'non_field_errors') {
            const errorValue = backendErrors[key];
            if (Array.isArray(errorValue)) {
              parsedErrors[key] = errorValue[0];
            } else if (typeof errorValue === 'string') {
              parsedErrors[key] = errorValue;
            }
          }
        });
        
        if (Object.keys(parsedErrors).length > 0) {
          setFieldErrors(parsedErrors);
        }
      }

      const message =
        error?.response?.data?.detail ??
        error?.response?.data?.non_field_errors?.[0] ??
        error?.message ??
        'İlan güncellenirken bir hata oluştu. Lütfen tekrar deneyin.';
      
      toast({
        title: 'Hata',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormValue = <K extends keyof ListingFormValues>(
    key: K,
    value: ListingFormValues[K]
  ) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[key]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const isFormValid = useMemo(() => {
    return (
      formValues.boat_type &&
      formValues.brand_name &&
      formValues.year_built &&
      formValues.location_province &&
      formValues.location_district &&
      formValues.length_m &&
      formValues.capacity_people &&
      formValues.cabin_count &&
      formValues.hull_type &&
      formValues.license_type &&
      formValues.engine_count &&
      formValues.fuel_type &&
      formValues.seller_type &&
      !phoneError &&
      formValues.contact_phone
    );
  }, [formValues, phoneError]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">İlanı Düzenle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Kapat"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Temel Bilgiler */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">İlan Başlığı *</label>
                  <input
                    type="text"
                    value={formValues.title}
                    onChange={(e) => updateFormValue('title', e.target.value)}
                    className={`w-full rounded-lg border p-2 text-sm ${
                      fieldErrors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Örn: 2020 Model Lüks Motoryat"
                  />
                  {fieldErrors.title && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.title}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Açıklama *</label>
                  <textarea
                    className={`w-full rounded-lg border p-2 text-sm ${
                      fieldErrors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={6}
                    value={formValues.description}
                    onChange={(e) => updateFormValue('description', e.target.value)}
                    placeholder="Teknenin özelliklerini, durumunu ve diğer önemli bilgileri detaylıca açıklayın..."
                  />
                  {fieldErrors.description && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.description}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Kimlik & Konum */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Kimlik & Konum</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Tekne türü *</label>
                  <select
                    className={`w-full rounded-lg border p-2 text-sm ${
                      fieldErrors.boat_type ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formValues.boat_type}
                    onChange={(e) => updateFormValue('boat_type', e.target.value)}
                  >
                    <option value="">Seçiniz</option>
                    <option value="motor-yat">Motoryat</option>
                    <option value="yelkenli">Yelkenli</option>
                    <option value="gulet">Gulet</option>
                    <option value="katamaran">Katamaran</option>
                    <option value="diğer">Diğer</option>
                  </select>
                  {fieldErrors.boat_type && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.boat_type}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Marka & Model *</label>
                  <input
                    type="text"
                    className={`w-full rounded-lg border p-2 text-sm ${
                      fieldErrors.brand_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formValues.brand_name}
                    onChange={(e) => handleBrandModelChange(e.target.value)}
                    placeholder='Özel yapımsa "Özel Yapım" yazın'
                  />
                  {fieldErrors.brand_name && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.brand_name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Yapım yılı *</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    className={`w-full rounded-lg border p-2 text-sm ${
                      fieldErrors.year_built ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formValues.year_built ?? ""}
                    onChange={(e) =>
                      updateFormValue('year_built', e.target.value ? Number(e.target.value) : null)
                    }
                  />
                  {fieldErrors.year_built && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.year_built}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">İl *</label>
                    <select
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.location_province ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.location_province}
                      onChange={(e) => handleCityChange(e.target.value)}
                    >
                      <option value="">İl seçin</option>
                      {TR_CITIES.map((city) => (
                        <option key={city.value} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.location_province && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.location_province}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">İlçe *</label>
                    <select
                      className={`w-full rounded-lg border p-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        fieldErrors.location_district ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.location_district}
                      onChange={(e) => updateFormValue('location_district', e.target.value)}
                      disabled={!selectedCity}
                    >
                      <option value="">İlçe seçin</option>
                      {selectedCity?.districts.map((district) => (
                        <option key={district.value} value={district.value}>
                          {district.label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.location_district && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.location_district}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Ruhsat tipi *</label>
                    <select
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.license_type ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.license_type}
                      onChange={(e) => updateFormValue('license_type', e.target.value)}
                    >
                      <option value="özel">Bireysel / Özel</option>
                      <option value="ticari">Ticari</option>
                    </select>
                    {fieldErrors.license_type && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.license_type}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Bayrağı</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      value={formValues.country_of_registry}
                      onChange={(e) => updateFormValue('country_of_registry', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Teknik Özellikler */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Teknik Özellikler</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Boy (m) *</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.length_m ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.length_m ?? ""}
                      onChange={(e) =>
                        updateFormValue('length_m', e.target.value ? Number(e.target.value) : null)
                      }
                    />
                    {fieldErrors.length_m && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.length_m}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">En (m)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      value={formValues.beam_m ?? ""}
                      onChange={(e) =>
                        updateFormValue('beam_m', e.target.value ? Number(e.target.value) : null)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Kapasite (kişi) *</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.capacity_people ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.capacity_people ?? ""}
                      onChange={(e) =>
                        updateFormValue('capacity_people', e.target.value ? Number(e.target.value) : null)
                      }
                    />
                    {fieldErrors.capacity_people && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.capacity_people}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Kamara sayısı *</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.cabin_count ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.cabin_count ?? ""}
                      onChange={(e) =>
                        updateFormValue('cabin_count', e.target.value ? Number(e.target.value) : null)
                      }
                    />
                    {fieldErrors.cabin_count && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.cabin_count}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Motor adedi *</label>
                    <select
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.engine_count ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.engine_count ?? 1}
                      onChange={(e) =>
                        updateFormValue('engine_count', Number(e.target.value))
                      }
                    >
                      <option value={1}>Tek motor</option>
                      <option value={2}>Çift motor</option>
                    </select>
                    {fieldErrors.engine_count && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.engine_count}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Motor bilgisi</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                    value={formValues.engine_info_note ?? ""}
                    onChange={(e) =>
                      updateFormValue('engine_info_note', e.target.value || null)
                    }
                    placeholder="Örn: Twin diesel engines, 500 HP each"
                    rows={3}
                    maxLength={300}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formValues.engine_info_note?.length || 0} / 300 karakter
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Yakıt tipi *</label>
                    <select
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.fuel_type ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.fuel_type}
                      onChange={(e) => updateFormValue('fuel_type', e.target.value)}
                    >
                      <option value="dizel">Dizel</option>
                      <option value="benzin">Benzin</option>
                      <option value="elektrik">Elektrik</option>
                      <option value="hibrit">Hibrit</option>
                      <option value="diğer">Diğer</option>
                    </select>
                    {fieldErrors.fuel_type && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.fuel_type}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Gövde tipi *</label>
                    <select
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.hull_type ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.hull_type}
                      onChange={(e) => updateFormValue('hull_type', e.target.value)}
                    >
                      <option value="">Seçiniz</option>
                      <option value="fiberglass">Fiberglass</option>
                      <option value="aluminyum">Alüminyum</option>
                      <option value="ahşap">Ahşap</option>
                      <option value="çelik">Çelik</option>
                      <option value="kompozit">Kompozit</option>
                      <option value="diğer">Diğer</option>
                    </select>
                    {fieldErrors.hull_type && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.hull_type}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Fiyat */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Fiyat</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Fiyat</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`w-full rounded-lg border p-2 text-sm ${
                        fieldErrors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={formValues.price ?? ""}
                      onChange={(e) =>
                        updateFormValue('price', e.target.value ? Number(e.target.value) : null)
                      }
                      placeholder="Fiyat girin"
                      disabled={formValues.price_on_request}
                    />
                    {fieldErrors.price && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.price}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-800">Para birimi</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      value={formValues.currency}
                      onChange={(e) =>
                        updateFormValue('currency', e.target.value as "TRY" | "USD" | "EUR")
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
            </section>

            {/* Satıcı Bilgileri */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Satıcı Bilgileri</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">Satıcı tipi *</label>
                  <select
                    className={`w-full rounded-lg border p-2 text-sm ${
                      fieldErrors.seller_type ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formValues.seller_type}
                    onChange={(e) =>
                      updateFormValue('seller_type', e.target.value as "owner" | "realtor" | "broker" | "other")
                    }
                  >
                    <option value="owner">Sahibinden</option>
                    <option value="realtor">Emlakçı</option>
                    <option value="broker">Broker</option>
                    <option value="other">Diğer</option>
                  </select>
                  {fieldErrors.seller_type && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.seller_type}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-800">İletişim telefonu *</label>
                  <input
                    type="tel"
                    className={`w-full rounded-lg border p-2 text-sm ${
                      fieldErrors.contact_phone || phoneError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formValues.contact_phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Örn: +90 555 123 45 67"
                  />
                  {(fieldErrors.contact_phone || phoneError) && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.contact_phone || phoneError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Format serbest, minimum 7 rakam
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isSubmitting}
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
