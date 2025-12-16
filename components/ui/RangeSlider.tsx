'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  disabled?: boolean;
  onValueChange: (v: [number, number]) => void;
  onValueCommit?: (v: [number, number]) => void;
  ariaLabel?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  disabled,
  onValueChange,
  onValueCommit,
  ariaLabel = 'Range slider',
}: RangeSliderProps) {
  const safe: [number, number] = React.useMemo(() => {
    const a = clamp(value[0], min, max);
    const b = clamp(value[1], min, max);
    return a <= b ? [a, b] : [b, a];
  }, [value, min, max]);

  return (
    <SliderPrimitive.Root
      min={min}
      max={max}
      step={step}
      value={safe}
      disabled={disabled}
      aria-label={ariaLabel}
      onValueChange={(v) => onValueChange([v[0] ?? min, v[1] ?? max])}
      onValueCommit={(v) => onValueCommit?.([v[0] ?? min, v[1] ?? max])}
      className={[
        // native feel + touch
        'relative flex w-full touch-none select-none items-center',
        // 44px hit row
        'h-11',
        disabled ? 'opacity-60' : '',
      ].join(' ')}
    >
      <SliderPrimitive.Track
        className={[
          'relative h-2 w-full grow overflow-hidden rounded-full',
          // token'lı track
          'bg-[color:var(--color-border)]',
        ].join(' ')}
      >
        <SliderPrimitive.Range
          className={[
            'absolute h-full',
            'bg-[color:var(--color-primary)]',
          ].join(' ')}
        />
      </SliderPrimitive.Track>

      {[0, 1].map((i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={[
            'relative block',
            // Görsel thumb
            'h-6 w-6 rounded-full',
            'border border-[color:var(--color-border)]',
            'bg-[color:var(--color-bg-primary)]',
            // Hafif depth
            'shadow-[0_1px_2px_color-mix(in_oklch,var(--color-text-primary),transparent_85%)]',
            // Focus ring (token)
            'focus-visible:outline-none',
            'focus-visible:ring-[length:var(--focus-ring-width)]',
            'focus-visible:ring-[color:var(--color-focus-ring)]',
            'focus-visible:ring-offset-[length:var(--focus-ring-offset)]',
            'focus-visible:ring-offset-[color:var(--color-bg-primary)]',
            // 44px hit-area (pseudo büyütme)
            "after:content-[''] after:absolute after:-inset-3 after:rounded-full after:bg-transparent",
          ].join(' ')}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
