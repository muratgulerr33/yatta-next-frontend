/**
 * Media URL helper functions
 * 
 * Builds media URLs using NEXT_PUBLIC_MEDIA_BASE_URL environment variable.
 * Falls back to http://127.0.0.1:8000 for development if not set.
 */

/**
 * Gets the media base URL from environment variable or falls back to default
 */
function getMediaBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  
  if (baseUrl) {
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }
  
  // Fallback to development default
  return 'http://127.0.0.1:8000';
}

/**
 * Builds a complete media URL from a path
 * 
 * @param path - Media path (e.g., '/media/categories/kiralama.webp' or 'media/categories/kiralama.webp')
 * @returns Complete media URL
 * 
 * @example
 * buildMediaUrl('/media/categories/kiralama.webp')
 * // Returns: 'http://127.0.0.1:8000/media/categories/kiralama.webp' (dev)
 * // or: 'https://api.yatta.com.tr/media/categories/kiralama.webp' (prod)
 */
export function buildMediaUrl(path: string): string {
  if (!path) {
    return '';
  }
  
  // If path is already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Normalize path: ensure it starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Combine base URL with normalized path
  const baseUrl = getMediaBaseUrl();
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Checks if a URL is a media URL (starts with media base URL)
 */
export function isMediaUrl(url: string): boolean {
  if (!url) return false;
  
  const baseUrl = getMediaBaseUrl();
  return url.startsWith(baseUrl) || url.startsWith('/media/');
}

