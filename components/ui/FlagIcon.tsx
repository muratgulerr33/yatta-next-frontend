'use client';

import React from 'react';
import Flag from 'react-flagpack';

interface FlagIconProps {
  /**
   * Ülke kodu (ISO 3166-1 alpha-2 formatında)
   * Örnekler: 'TR', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'GR', 'PT', 'IE', 'IS', 'LU', 'MT', 'CY', 'EE', 'LV', 'LT', 'SI', 'SK', 'HU', 'RO', 'BG', 'HR', 'RS', 'BA', 'MK', 'AL', 'ME', 'XK', 'MD', 'UA', 'BY', 'RU', 'GE', 'AM', 'AZ', 'KZ', 'UZ', 'TM', 'TJ', 'KG', 'AF', 'PK', 'IN', 'BD', 'LK', 'MV', 'NP', 'BT', 'MM', 'TH', 'LA', 'VN', 'KH', 'MY', 'SG', 'BN', 'ID', 'PH', 'TL', 'CN', 'TW', 'HK', 'MO', 'JP', 'KR', 'KP', 'MN', 'AU', 'NZ', 'PG', 'FJ', 'NC', 'PF', 'WS', 'TO', 'VU', 'SB', 'KI', 'TV', 'NR', 'PW', 'FM', 'MH', 'AS', 'GU', 'MP', 'VI', 'PR', 'CA', 'MX', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA', 'CU', 'JM', 'HT', 'DO', 'BS', 'BB', 'AG', 'DM', 'LC', 'VC', 'GD', 'KN', 'TT', 'GY', 'SR', 'BR', 'CO', 'VE', 'GY', 'EC', 'PE', 'BO', 'PY', 'UY', 'AR', 'CL', 'FK', 'ZA', 'NA', 'BW', 'ZW', 'ZM', 'MW', 'MZ', 'MG', 'MU', 'SC', 'KM', 'YT', 'RE', 'KE', 'TZ', 'UG', 'RW', 'BI', 'ET', 'ER', 'DJ', 'SO', 'SS', 'SD', 'EG', 'LY', 'TN', 'DZ', 'MA', 'EH', 'MR', 'ML', 'NE', 'TD', 'SN', 'GM', 'GN', 'GW', 'SL', 'LR', 'CI', 'BF', 'GH', 'TG', 'BJ', 'NG', 'CM', 'GQ', 'GA', 'CG', 'CD', 'CF', 'ST', 'AO', 'ZM', 'MW', 'MZ', 'MG', 'MU', 'SC', 'KM', 'YT', 'RE', 'KE', 'TZ', 'UG', 'RW', 'BI', 'ET', 'ER', 'DJ', 'SO', 'SS', 'SD', 'EG', 'LY', 'TN', 'DZ', 'MA', 'EH', 'MR', 'ML', 'NE', 'TD', 'SN', 'GM', 'GN', 'GW', 'SL', 'LR', 'CI', 'BF', 'GH', 'TG', 'BJ', 'NG', 'CM', 'GQ', 'GA', 'CG', 'CD', 'CF', 'ST', 'AO'
   */
  code: string;
  /**
   * Bayrak boyutu (piksel cinsinden)
   * @default 32
   */
  size?: number;
  /**
   * Yuvarlak bayrak gösterimi
   * @default false
   */
  rounded?: boolean;
  /**
   * CSS class adı
   */
  className?: string;
}

/**
 * Flagpack bayrak ikonu component'i
 * 
 * Tüm dünya ülkelerinin bayraklarını gösterir.
 * 
 * @example
 * ```tsx
 * <FlagIcon code="TR" size={48} />
 * <FlagIcon code="US" size={32} rounded />
 * ```
 */
export const FlagIcon: React.FC<FlagIconProps> = ({
  code,
  size = 32,
  rounded = false,
  className = '',
}) => {
  const roundedClass = rounded ? 'rounded-full overflow-hidden' : '';
  const combinedClassName = `${className} ${roundedClass}`.trim();

  return (
    <Flag
      code={code}
      size={size.toString()}
      className={combinedClassName || undefined}
    />
  );
};

export default FlagIcon;

