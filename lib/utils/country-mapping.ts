/**
 * Ülke kodlarından ülke isimlerine mapping
 */

const COUNTRY_MAP: Record<string, string> = {
  TR: 'Türkiye',
  US: 'ABD',
  GB: 'İngiltere',
  MT: 'Malta',
  NL: 'Hollanda',
  FR: 'Fransa',
  IT: 'İtalya',
  ES: 'İspanya',
  GR: 'Yunanistan',
  DİĞER: 'Diğer',
};

const REVERSE_COUNTRY_MAP: Record<string, string> = {
  'Türkiye': 'TR',
  'ABD': 'US',
  'İngiltere': 'GB',
  'Malta': 'MT',
  'Hollanda': 'NL',
  'Fransa': 'FR',
  'İtalya': 'IT',
  'İspanya': 'ES',
  'Yunanistan': 'GR',
  'Diğer': 'DİĞER',
};

/**
 * Ülke kodunu ülke ismine çevirir
 * @param code Ülke kodu (örn: "TR")
 * @returns Ülke ismi (örn: "Türkiye") veya kodun kendisi (mapping bulunamazsa)
 */
export function getCountryName(code: string | null | undefined): string {
  if (!code) return '';
  return COUNTRY_MAP[code.toUpperCase()] || code;
}

/**
 * Ülke ismini ülke koduna çevirir
 * @param name Ülke ismi (örn: "Türkiye")
 * @returns Ülke kodu (örn: "TR") veya ismin kendisi (mapping bulunamazsa)
 */
export function getCountryCode(name: string | null | undefined): string {
  if (!name) return '';
  return REVERSE_COUNTRY_MAP[name] || name;
}

