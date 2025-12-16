import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseStyles = `
      inline-flex items-center justify-center
      font-semibold
      rounded-lg
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      h-12
      shadow-sm hover:shadow
      appearance-none
    `;

    const variantStyles = {
      primary: `
        bg-[color:var(--color-primary)] text-[color:var(--color-text-inverse)]
        hover:bg-[color:var(--color-primary-hover)]
        focus:ring-[color:var(--color-focus-ring)]
        active:bg-[color:var(--color-primary-active)]
      `,
      secondary: `
        bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-primary)]
        hover:bg-[color:var(--color-bg-tertiary)]
        focus:ring-[color:var(--color-focus-ring)]
        active:bg-[color:var(--color-bg-tertiary)]
      `,
      outline: `
        border-2 border-[color:var(--color-border)] text-[color:var(--color-text-primary)] bg-[color:var(--color-bg-primary)]
        hover:bg-[color:var(--color-bg-secondary)] hover:border-[color:var(--color-border-focus)]
        focus:ring-[color:var(--color-focus-ring)]
        active:bg-[color:var(--color-bg-secondary)]
      `,
      destructive: `
        bg-red-600 text-white
        hover:bg-red-700
        focus:ring-red-500
        active:bg-red-800
      `,
    };

    const sizeStyles = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Yükleniyor...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

