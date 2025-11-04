// Next.js 15 App Router middleware

import { NextResponse, NextRequest } from "next/server";

// İzleme parametreleri: kanoniğe taşımayacağız

const TRACKING_PARAMS = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"];

// Türkçe karakterleri ASCII'ye indirgeme (slug/URL için)

function toAsciiTR(s: string) {

  const map: Record<string,string> = {

    "ğ":"g","ü":"u","ş":"s","ı":"i","İ":"i","ö":"o","ç":"c",

    "Ğ":"g","Ü":"u","Ş":"s","Ö":"o","Ç":"c"

  };

  return s.replace(/[ğüşıİöçĞÜŞÖÇ]/g, ch => map[ch] || ch);

}

export function middleware(req: NextRequest) {

  const url = new URL(req.url);

  const origPath = url.pathname;

  // NOT: Trailing slash normalizasyonu Next.js base server'da yapılıyor (308 ile)
  // Bu middleware'den ÖNCE çalıştığı için burada handle edemiyoruz
  // Bu yüzden sadece case normalization ve tracking params için kullanıyoruz
  
  // 1) TR→ASCII + lowercase (trailing slash'i Next.js handle ediyor)

  let path = toAsciiTR(origPath).toLowerCase();

  // 3) Çoklu tire → tek tire

  path = path.replace(/-{2,}/g, "-");

  // 4) İzleme paramlarını sil

  let paramsChanged = false;

  for (const p of TRACKING_PARAMS) {

    if (url.searchParams.has(p)) {

      url.searchParams.delete(p);

      paramsChanged = true;

    }

  }

  // 5) Yeniden yönlendirme gerekiyorsa 301 ile dön
  // NOT: Trailing slash için Next.js 308 döndürüyor (base server normalizasyonu)
  // Bu middleware'den önce çalıştığı için burada handle edemiyoruz
  // Sadece case normalization ve tracking params için 301 döndürüyoruz

  if (path !== origPath || paramsChanged) {

    url.pathname = path;
    // Search params'ı güncelle (izleme parametreleri silinmiş olabilir)
    url.search = url.searchParams.toString();

    // Next.js 15'te redirect() 308 döndürüyor, manuel 301 yapalım
    // Absolute URL yerine relative path kullan
    const redirectPath = url.pathname + (url.search ? '?' + url.search : '');
    
    // Response objesi oluştur ve status'u 301 olarak ayarla
    return new NextResponse(null, {
      status: 301,
      statusText: 'Moved Permanently',
      headers: {
        'Location': redirectPath,
      },
    });

  }

  return NextResponse.next();

}

// _next, statikler, robots/sitemap vb. hariç tut

export const config = {

  matcher: ["/((?!_next/|favicon.ico|robots.txt|sitemap|images/|static/|manifest.json).*)"],

};
