'use client';

import * as React from 'react';
import { RangeSlider } from '@/components/ui/RangeSlider';
import clsx from 'clsx';

export interface PriceRangeControlProps {
  minValue: string;
  maxValue: string;
  onChange: (min: string, max: string) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

// Default price range bounds
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100_000_000; // 100M TL
const DEFAULT_STEP = 1000;

export const PriceRangeControl = React.memo<PriceRangeControlProps>(
  ({
    minValue,
    maxValue,
    onChange,
    min = DEFAULT_MIN,
    max = DEFAULT_MAX,
    step = DEFAULT_STEP,
    label = 'Fiyat Aralığı (TL)',
    className,
  }) => {
    // Parse string values to numbers, with fallbacks
    const parseValue = React.useCallback((val: string): number | null => {
      if (!val || val.trim() === '') return null;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? null : parsed;
    }, []);

    const minNum = parseValue(minValue);
    const maxNum = parseValue(maxValue);

    // Slider value: ALWAYS use field bounds (0-100M), NOT selected values
    // UI shows full range, but filter may have unset values (empty string)
    const sliderValue: [number, number] = React.useMemo(() => {
      // Clamp parsed values to field bounds, or use bounds if null
      const sliderMin = minNum !== null ? Math.max(min, Math.min(minNum, max)) : min;
      const sliderMax = maxNum !== null ? Math.max(sliderMin, Math.min(maxNum, max)) : max;
      return [sliderMin, sliderMax];
    }, [minNum, maxNum, min, max]);

    // Track previous slider value to prevent unnecessary updates
    const prevSliderValueRef = React.useRef<[number, number]>(sliderValue);

    // Handle slider change
    const handleSliderChange = React.useCallback(
      (newValue: [number, number]) => {
        const [newMin, newMax] = newValue;
        
        // Prevent infinite loop: only update if value actually changed
        if (
          prevSliderValueRef.current[0] === newMin &&
          prevSliderValueRef.current[1] === newMax
        ) {
          return;
        }
        
        prevSliderValueRef.current = [newMin, newMax];
        
        // Convert to strings: if value equals bound, use empty string (unset)
        const minStr = newMin === min ? '' : String(newMin);
        const maxStr = newMax === max ? '' : String(newMax);
        
        onChange(minStr, maxStr);
      },
      [min, max, onChange]
    );

    // Handle input change
    const handleMinInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue, maxValue);
      },
      [maxValue, onChange]
    );

    const handleMaxInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(minValue, newValue);
      },
      [minValue, onChange]
    );

    // Format for display (TR locale)
    const formatPrice = React.useCallback((n: number) => {
      return new Intl.NumberFormat('tr-TR').format(n);
    }, []);

    return (
      <div className={clsx('space-y-4', className)}>
        <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </label>
        
        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Min
            </label>
            <input
              type="number"
              value={minValue}
              onChange={handleMinInputChange}
              placeholder="0"
              min={min}
              max={max}
              className="w-full px-3 py-2.5 h-11 rounded-xl border focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-border-focus)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
              }}
              aria-label="Minimum fiyat"
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Max
            </label>
            <input
              type="number"
              value={maxValue}
              onChange={handleMaxInputChange}
              placeholder="∞"
              min={min}
              max={max}
              className="w-full px-3 py-2.5 h-11 rounded-xl border focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-border-focus)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
              }}
              aria-label="Maksimum fiyat"
            />
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <RangeSlider
            min={min}
            max={max}
            value={sliderValue}
            onValueChange={handleSliderChange}
            step={step}
            ariaLabel="Fiyat aralığı"
          />
        </div>
      </div>
    );
  }
);

PriceRangeControl.displayName = 'PriceRangeControl';

