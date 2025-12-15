'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { ListingDetail } from '@/lib/api';

export default function BreadcrumbNavClient({ listing }: { listing: ListingDetail }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!containerRef.current || !linkRef.current) return;

    const container = containerRef.current;
    const link = linkRef.current;
    const linkText = link.textContent || '';

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'BreadcrumbNavClient.tsx:useEffect',
        message: 'Breadcrumb container dimensions',
        data: {
          containerWidth: container.offsetWidth,
          containerScrollWidth: container.scrollWidth,
          windowWidth: window.innerWidth,
          isMobile: window.innerWidth < 768,
          linkText,
          linkWidth: link.offsetWidth,
          linkScrollWidth: link.scrollWidth,
          linkComputedStyle: {
            whiteSpace: window.getComputedStyle(link).whiteSpace,
            flexWrap: window.getComputedStyle(container).flexWrap,
            overflowX: window.getComputedStyle(container).overflowX,
            flexShrink: window.getComputedStyle(link).flexShrink,
          },
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A',
      }),
    }).catch(() => {});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'BreadcrumbNavClient.tsx:useEffect',
        message: 'Text wrapping check',
        data: {
          linkText,
          hasSpace: linkText.includes(' '),
          textLength: linkText.length,
          isWrapping: link.scrollWidth > link.offsetWidth,
          containerOverflow: container.scrollWidth > container.offsetWidth,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A',
      }),
    }).catch(() => {});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'BreadcrumbNavClient.tsx:useEffect',
        message: 'Flex container properties',
        data: {
          flexWrap: window.getComputedStyle(container).flexWrap,
          flexDirection: window.getComputedStyle(container).flexDirection,
          justifyContent: window.getComputedStyle(container).justifyContent,
          alignItems: window.getComputedStyle(container).alignItems,
          gap: window.getComputedStyle(container).gap,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'B',
      }),
    }).catch(() => {});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'BreadcrumbNavClient.tsx:useEffect',
        message: 'Overflow and scroll properties',
        data: {
          containerOverflowX: window.getComputedStyle(container).overflowX,
          containerOverflowY: window.getComputedStyle(container).overflowY,
          containerScrollWidth: container.scrollWidth,
          containerClientWidth: container.clientWidth,
          hasHorizontalScroll: container.scrollWidth > container.clientWidth,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'C',
      }),
    }).catch(() => {});
    // #endregion

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'BreadcrumbNavClient.tsx:useEffect',
        message: 'Link flex properties',
        data: {
          linkFlexShrink: window.getComputedStyle(link).flexShrink,
          linkFlexGrow: window.getComputedStyle(link).flexGrow,
          linkFlexBasis: window.getComputedStyle(link).flexBasis,
          linkMinWidth: window.getComputedStyle(link).minWidth,
          linkWidth: link.offsetWidth,
          linkScrollWidth: link.scrollWidth,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'E',
      }),
    }).catch(() => {});
    // #endregion

    const handleResize = () => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'BreadcrumbNavClient.tsx:handleResize',
          message: 'Window resize event',
          data: {
            windowWidth: window.innerWidth,
            isMobile: window.innerWidth < 768,
            containerWidth: container.offsetWidth,
            linkWidth: link.offsetWidth,
            isWrapping: link.scrollWidth > link.offsetWidth,
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'D',
        }),
      }).catch(() => {});
      // #endregion
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [listing]);

  return (
    <nav className="text-sm text-[color:var(--color-text-secondary)] mb-4">
      <div 
        ref={containerRef} 
        className="flex items-center gap-2 flex-nowrap whitespace-nowrap overflow-x-auto min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <Link
          href="/"
          className="hover:text-[color:var(--color-primary)] transition-colors whitespace-nowrap flex-shrink-0"
        >
          Ana Sayfa
        </Link>
        <span className="flex-shrink-0">/</span>
        <Link
          ref={linkRef}
          href="/satilik-tekneler"
          className="hover:text-[color:var(--color-primary)] transition-colors whitespace-nowrap flex-shrink-0"
        >
          Satılık Tekneler
        </Link>
        <span className="flex-shrink-0">/</span>
        <span
          className="truncate text-[color:var(--color-text-primary)] min-w-0"
          title={listing.title}
        >
          {listing.title}
        </span>
      </div>
    </nav>
  );
}

