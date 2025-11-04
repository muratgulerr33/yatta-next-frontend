// lib/slugId.ts — {slug}-{id} ayrıştırma + normalize + build

export function parseSlugId(input: string) {
  // "lorhan-yat-1-saatlik-101" => slug: "lorhan-yat-1-saatlik", id: 101
  const m = input.match(/^(.*)-(\d+)$/);
  if (!m) return { slug: null as string | null, id: null as number | null };
  const slug = m[1];
  const id = Number(m[2]);
  if (!Number.isInteger(id)) return { slug: null, id: null };
  return { slug, id };
}

export function normalizeSlug(s: string) {
  const map: Record<string, string> = {
    "ğ": "g", "ü": "u", "ş": "s", "ı": "i", "İ": "i", "ö": "o", "ç": "c",
    "Ğ": "g", "Ü": "u", "Ş": "s", "Ö": "o", "Ç": "c"
  };
  return s
    .replace(/[ğüşıİöçĞÜŞÖÇ]/g, ch => map[ch] || ch) // TR -> ASCII
    .toLowerCase()
    .replace(/\s+/g, "-")         // boşluk -> -
    .replace(/-{2,}/g, "-")       // çoklu - -> tek
    .replace(/[^a-z0-9-]/g, "");  // güvenli karakterler
}

export function buildSlugId(slug: string, id: number | string) {
  return `${normalizeSlug(slug)}-${id}`;
}

