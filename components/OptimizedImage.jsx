// Optimized Image Component - next/image kullanımı için yardımcı component
'use client'

import Image from 'next/image'

/**
 * Optimized Image Component
 * Next.js Image Optimization ile otomatik resize, format conversion ve lazy loading
 * 
 * @param {string} src - Image source (local veya remote)
 * @param {string} alt - Alt text (accessibility için zorunlu)
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} className - CSS classes
 * @param {object} priority - Priority loading (above-the-fold için true)
 * @param {string} fill - Fill container (width/height yerine)
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  ...props
}) {
  // Remote image için domain whitelist (next.config.js'de de tanımlanmalı)
  const isRemote = src.startsWith('http://') || src.startsWith('https://')
  
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    )
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      {...props}
    />
  )
}

