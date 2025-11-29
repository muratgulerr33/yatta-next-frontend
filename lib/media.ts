/**
 * Media URL Helper
 * Backend MEDIA_URL ile görsel path'lerini birleştirir
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Get full media URL from relative path
 * @param imagePath - Backend'den gelen relative path (örn: "listings/2024/01/image.jpg")
 * @returns Full URL (development: http://127.0.0.1:8000/media/..., production: https://api.yatta.com.tr/media/...)
 */
export function getMediaUrl(imagePath: string): string {
  if (!imagePath) return "";
  
  // Zaten tam URL ise direkt döndür
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Relative path'i normalize et (başında / varsa kaldır)
  const normalizedPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  
  // MEDIA_URL genellikle /media/ ile başlar
  const mediaPath = normalizedPath.startsWith("media/") 
    ? normalizedPath 
    : `media/${normalizedPath}`;

  // Base URL ile birleştir
  const baseUrl = API_BASE_URL.endsWith("/") 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;

  return `${baseUrl}/${mediaPath}`;
}

