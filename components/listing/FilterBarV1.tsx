'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Dialog, Popover } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { TR_CITIES } from '@/data/locations/tr-cities';
import clsx from 'clsx';
import { PriceRangeControl } from './PriceRangeControl';

interface FilterState {
  search: string;
  location_province: string;
  boat_type: string;
  price_min: string;
  price_max: string;
  length_min: string;
  length_max: string;
  year_min: string;
  year_max: string;
}

const BOAT_TYPES = [
  { value: 'motoryat', label: 'Motoryat' },
  { value: 'yelkenli', label: 'Yelkenli' },
  { value: 'katamaran', label: 'Katamaran' },
  { value: 'gulet', label: 'Gulet' },
];

const ALLOWED_PARAMS = [
  'search',
  'location_province',
  'boat_type',
  'price_min',
  'price_max',
  'length_min',
  'length_max',
  'year_min',
  'year_max',
];


export default function FilterBarV1() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  // Popover local states
  const [priceMinLocal, setPriceMinLocal] = useState('');
  const [priceMaxLocal, setPriceMaxLocal] = useState('');
  const [lengthMinLocal, setLengthMinLocal] = useState('');
  const [lengthMaxLocal, setLengthMaxLocal] = useState('');

  // Stable key from searchParams (string, not object)
  const spKey = searchParams.toString();

  // Parse filters from URL - stable memoized version
  const filters = useMemo(() => {
    return {
      search: searchParams.get('search') || '',
      location_province: searchParams.get('location_province') || '',
      boat_type: searchParams.get('boat_type') || '',
      price_min: searchParams.get('price_min') || '',
      price_max: searchParams.get('price_max') || '',
      length_min: searchParams.get('length_min') || '',
      length_max: searchParams.get('length_max') || '',
      year_min: searchParams.get('year_min') || '',
      year_max: searchParams.get('year_max') || '',
    };
  }, [spKey]);

  // Initialize search input from URL
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Initialize popover local states from URL
  useEffect(() => {
    setPriceMinLocal(filters.price_min);
    setPriceMaxLocal(filters.price_max);
    setLengthMinLocal(filters.length_min);
    setLengthMaxLocal(filters.length_max);
  }, [filters.price_min, filters.price_max, filters.length_min, filters.length_max]);

  // Build search params string
  const buildSearchParams = useCallback(
    (patch: Partial<FilterState>, removeEmpty = true): string => {
      const current = filters;
      const merged = { ...current, ...patch };

      const params = new URLSearchParams();
      ALLOWED_PARAMS.forEach((key) => {
        const value = merged[key as keyof FilterState];
        const shouldAppend = value && (!removeEmpty || value.trim() !== '');
        if (shouldAppend) {
          params.append(key, value);
        }
      });

      return params.toString();
    },
    [filters]
  );

  // Apply patch to URL
  const applyPatch = useCallback(
    (patch: Partial<FilterState>) => {
      const queryString = buildSearchParams(patch);
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(url, { scroll: false });
    },
    [pathname, router, buildSearchParams]
  );

  // Clear all filters
  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
    setIsDialogOpen(false);
  }, [pathname, router]);

  // Handle search input
  const handleSearchSubmit = useCallback(() => {
    applyPatch({ search: searchInput.trim() });
  }, [searchInput, applyPatch]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Get city label
  const getCityLabel = (value: string) => {
    const city = TR_CITIES.find((c) => c.value === value);
    return city?.label || value;
  };

  // Format price range
  const formatPriceRange = (min: string, max: string) => {
    if (!min && !max) return '';
    const minNum = min ? parseInt(min).toLocaleString('tr-TR') : '';
    const maxNum = max ? parseInt(max).toLocaleString('tr-TR') : '';
    if (minNum && maxNum) return `${minNum}–${maxNum} TL`;
    if (minNum) return `${minNum}+ TL`;
    if (maxNum) return `Max ${maxNum} TL`;
    return '';
  };

  // Format length range
  const formatLengthRange = (min: string, max: string) => {
    if (!min && !max) return '';
    if (min && max) return `${min}–${max} m`;
    if (min) return `${min}+ m`;
    if (max) return `Max ${max} m`;
    return '';
  };

  // Format year range
  const formatYearRange = (min: string, max: string) => {
    if (!min && !max) return '';
    if (min && max) return `${min}–${max}`;
    if (min) return `${min}+`;
    if (max) return `Max ${max}`;
    return '';
  };

  // Get boat type label
  const getBoatTypeLabel = (value: string) => {
    const type = BOAT_TYPES.find((t) => t.value === value);
    return type?.label || value;
  };

  // Dialog state (draft)
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);
  
  // Guard: Track if dialog was just opened to prevent infinite loops
  const lastDialogOpenRef = useRef(false);
  const lastFiltersRef = useRef<FilterState>(filters);

  // Dialog açılınca URL'deki "applied" filtrelerden draft'ı initialize et
  useEffect(() => {
    // Only initialize when dialog transitions from closed to open
    if (!isDialogOpen) {
      lastDialogOpenRef.current = false;
      return;
    }
    
    // If dialog was already open, don't re-initialize unless filters actually changed
    if (lastDialogOpenRef.current) {
      // Deep comparison: check if filters actually changed
      const filtersChanged = Object.keys(filters).some(
        (key) => filters[key as keyof FilterState] !== lastFiltersRef.current[key as keyof FilterState]
      );
      
      if (!filtersChanged) {
        return;
      }
    }
    
    // Initialize draft from current filters
    lastDialogOpenRef.current = true;
    lastFiltersRef.current = filters;
    setDraftFilters(filters);
  }, [isDialogOpen, filters]);

  const handleDialogApply = () => {
    applyPatch(draftFilters);
    setIsDialogOpen(false);
  };

  return (
    <div className="sticky top-14 lg:top-16 z-30 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="page-shell px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile: Full-width search + filter icon */}
          <div className="flex-1 lg:flex-none lg:max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onBlur={handleSearchSubmit}
                placeholder="Tekne, marka veya model ara..."
                className="w-full pl-10 pr-4 py-2.5 h-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent"
                aria-label="Arama"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="lg:hidden p-2.5 h-11 w-11 rounded-xl border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              aria-label="Filtreler"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Desktop: Chips */}
          <div className="hidden lg:flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide whitespace-nowrap">
            {/* Konum Chip */}
            <Popover className="relative">
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className={clsx(
                      'px-4 py-2 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]',
                      filters.location_province
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {filters.location_province
                        ? `Konum: ${getCityLabel(filters.location_province)}`
                        : 'Konum'}
                      <ChevronDownIcon
                        className={clsx(
                          'w-4 h-4 transition-transform',
                          open && 'rotate-180'
                        )}
                      />
                    </span>
                  </Popover.Button>

                  <Popover.Panel className="absolute z-50 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şehir Seç
                      </label>
                      <select
                        value={filters.location_province}
                        onChange={(e) => {
                          applyPatch({ location_province: e.target.value });
                          close();
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                      >
                        <option value="">Tüm Şehirler</option>
                        {TR_CITIES.map((city) => (
                          <option key={city.value} value={city.value}>
                            {city.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>

            {/* Tekne Türü Chip */}
            <Popover className="relative">
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className={clsx(
                      'px-4 py-2 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]',
                      filters.boat_type
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {filters.boat_type
                        ? `Tür: ${getBoatTypeLabel(filters.boat_type)}`
                        : 'Tekne Türü'}
                      <ChevronDownIcon
                        className={clsx(
                          'w-4 h-4 transition-transform',
                          open && 'rotate-180'
                        )}
                      />
                    </span>
                  </Popover.Button>

                  <Popover.Panel className="absolute z-50 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tekne Türü
                      </label>
                      <div className="space-y-2">
                        {BOAT_TYPES.map((type) => (
                          <label
                            key={type.value}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="boat_type"
                              value={type.value}
                              checked={filters.boat_type === type.value}
                              onChange={(e) => {
                                applyPatch({ boat_type: e.target.value });
                                close();
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                            />
                            <span className="text-sm">{type.label}</span>
                          </label>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            applyPatch({ boat_type: '' });
                            close();
                          }}
                          className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                        >
                          Temizle
                        </button>
                      </div>
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>

            {/* Fiyat Chip */}
            <Popover className="relative">
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className={clsx(
                      'px-4 py-2 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]',
                      filters.price_min || filters.price_max
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {filters.price_min || filters.price_max
                        ? `Fiyat: ${formatPriceRange(
                            filters.price_min,
                            filters.price_max
                          )}`
                        : 'Fiyat'}
                      <ChevronDownIcon
                        className={clsx(
                          'w-4 h-4 transition-transform',
                          open && 'rotate-180'
                        )}
                      />
                    </span>
                  </Popover.Button>

                  <Popover.Panel className="absolute z-50 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Fiyat Aralığı (TL)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Min
                          </label>
                          <input
                            type="number"
                            value={priceMinLocal}
                            onChange={(e) => setPriceMinLocal(e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Max
                          </label>
                          <input
                            type="number"
                            value={priceMaxLocal}
                            onChange={(e) => setPriceMaxLocal(e.target.value)}
                            placeholder="∞"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            applyPatch({
                              price_min: priceMinLocal,
                              price_max: priceMaxLocal,
                            });
                            close();
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                        >
                          Uygula
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPriceMinLocal('');
                            setPriceMaxLocal('');
                            applyPatch({ price_min: '', price_max: '' });
                            close();
                          }}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                        >
                          Temizle
                        </button>
                      </div>
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>

            {/* Boy Chip */}
            <Popover className="relative">
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className={clsx(
                      'px-4 py-2 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]',
                      filters.length_min || filters.length_max
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {filters.length_min || filters.length_max
                        ? `Boy: ${formatLengthRange(
                            filters.length_min,
                            filters.length_max
                          )}`
                        : 'Boy'}
                      <ChevronDownIcon
                        className={clsx(
                          'w-4 h-4 transition-transform',
                          open && 'rotate-180'
                        )}
                      />
                    </span>
                  </Popover.Button>

                  <Popover.Panel className="absolute z-50 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Uzunluk Aralığı (m)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Min
                          </label>
                          <input
                            type="number"
                            value={lengthMinLocal}
                            onChange={(e) => setLengthMinLocal(e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Max
                          </label>
                          <input
                            type="number"
                            value={lengthMaxLocal}
                            onChange={(e) => setLengthMaxLocal(e.target.value)}
                            placeholder="∞"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            applyPatch({
                              length_min: lengthMinLocal,
                              length_max: lengthMaxLocal,
                            });
                            close();
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                        >
                          Uygula
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLengthMinLocal('');
                            setLengthMaxLocal('');
                            applyPatch({ length_min: '', length_max: '' });
                            close();
                          }}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                        >
                          Temizle
                        </button>
                      </div>
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>

            {/* Tüm Filtreler Button */}
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
            >
              Tüm Filtreler
            </button>
          </div>
        </div>
      </div>

      {/* Dialog / Bottom Sheet */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="relative z-[200]"
      >
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-end lg:items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl lg:max-w-3xl bg-white rounded-t-2xl lg:rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-xl font-bold text-gray-900">
                Filtreler
              </Dialog.Title>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                aria-label="Kapat"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Konum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <select
                  value={draftFilters.location_province}
                  onChange={(e) =>
                    setDraftFilters({
                      ...draftFilters,
                      location_province: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 h-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                >
                  <option value="">Tüm Şehirler</option>
                  {TR_CITIES.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tekne Türü */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tekne Türü
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {BOAT_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="dialog_boat_type"
                        value={type.value}
                        checked={draftFilters.boat_type === type.value}
                        onChange={(e) =>
                          setDraftFilters({
                            ...draftFilters,
                            boat_type: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fiyat */}
              <PriceRangeControl
                minValue={draftFilters.price_min}
                maxValue={draftFilters.price_max}
                onChange={(min, max) => {
                  setDraftFilters({
                    ...draftFilters,
                    price_min: min,
                    price_max: max,
                  });
                }}
                label="Fiyat Aralığı (TL)"
              />

              {/* Uzunluk */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uzunluk Aralığı (m)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Min
                    </label>
                    <input
                      type="number"
                      value={draftFilters.length_min}
                      onChange={(e) =>
                        setDraftFilters({
                          ...draftFilters,
                          length_min: e.target.value,
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2.5 h-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Max
                    </label>
                    <input
                      type="number"
                      value={draftFilters.length_max}
                      onChange={(e) =>
                        setDraftFilters({
                          ...draftFilters,
                          length_max: e.target.value,
                        })
                      }
                      placeholder="∞"
                      className="w-full px-3 py-2.5 h-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                    />
                  </div>
                </div>
              </div>

              {/* Yapım Yılı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yapım Yılı
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Min
                    </label>
                    <input
                      type="number"
                      value={draftFilters.year_min}
                      onChange={(e) =>
                        setDraftFilters({
                          ...draftFilters,
                          year_min: e.target.value,
                        })
                      }
                      placeholder="1900"
                      className="w-full px-3 py-2.5 h-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Max
                    </label>
                    <input
                      type="number"
                      value={draftFilters.year_max}
                      onChange={(e) =>
                        setDraftFilters({
                          ...draftFilters,
                          year_max: e.target.value,
                        })
                      }
                      placeholder="2025"
                      className="w-full px-3 py-2.5 h-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={clearAll}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              >
                Temizle
              </button>
              <button
                type="button"
                onClick={handleDialogApply}
                className="flex-1 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              >
                Sonuçları Göster
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

