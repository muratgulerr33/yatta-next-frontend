// app/page.jsx

import { redirect } from 'next/navigation';

// ISR cache - redirect sayfası da cache'lenir
export const revalidate = 3600; // 1 saat

// ✅ Ana sayfaya giren ziyaretçiler otomatik /yakindayiz sayfasına yönlendirilir
export default function HomePage() {
  redirect('/yakindayiz');
}

