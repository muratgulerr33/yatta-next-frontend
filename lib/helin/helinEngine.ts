import { 
  HelinEngineRequest, 
  HelinEngineResult, 
  HelinFaqItem, 
  HelinIntent, 
  HelinProduct,
  HelinService,
  HelinSessionContext
} from '@/types/helin';
import faqData from '@/data/faq.json';
import productData from '@/data/products.json';

// ============================================
// HELPER FUNCTIONS
// ============================================

// Türkçe karakterleri normalize et
function normalize(text: string): string {
  return text.toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

// İsim yakalama fonksiyonu (V1.1)
function extractUserName(message: string): string | null {
  const normalizedMsg = normalize(message);
  
  // Pattern'ler: "ismim X", "ben X", "adım X"
  const patterns = [
    /ismim\s+([a-zA-ZğüşıöçĞÜŞİÖÇ]+)/i,
    /\bben\s+([a-zA-ZğüşıöçĞÜŞİÖÇ]+)/i,
    /adım\s+([a-zA-ZğüşıöçĞÜŞİÖÇ]+)/i,
    /adim\s+([a-zA-ZğüşıöçĞÜŞİÖÇ]+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      // İlk harfi büyük yap
      const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      return name;
    }
  }

  return null;
}

// Servis seçimi yakalama (V1.1.1: Daha robust)
function extractService(message: string): HelinService | null {
  const normalizedMsg = normalize(message.trim()); // V1.1.1: trim eklendi

  // Evlilik teklifi
  if (normalizedMsg.includes('evlilik') || normalizedMsg.includes('teklif') || normalizedMsg.includes('evlenme')) {
    return 'evlilik-teklifi';
  }

  // Doğum günü
  if (normalizedMsg.includes('dogum') || normalizedMsg.includes('kutlama') || normalizedMsg.includes('dogumgunu')) {
    return 'dogum-gunu';
  }

  // Yat turu
  if (normalizedMsg.includes('yat') || normalizedMsg.includes('tur') || normalizedMsg.includes('tekne') || normalizedMsg.includes('kiralama') || normalizedMsg.includes('gezi')) {
    return 'yat-turu';
  }

  return null;
}

// V1.1.1: Mesajın sadece isim bildirimi olup olmadığını kontrol et
function isOnlyNameMessage(message: string, detectedName: string | null): boolean {
  if (!detectedName) return false;
  
  const normalizedMsg = normalize(message);
  
  // "ismim X", "ben X", "adım X" gibi basit pattern'ler
  const simpleNamePatterns = [
    /^ismim\s+[a-z]+$/,
    /^ben\s+[a-z]+$/,
    /^adim\s+[a-z]+$/,
    /^adım\s+[a-z]+$/,
  ];
  
  return simpleNamePatterns.some(pattern => pattern.test(normalizedMsg));
}

// FAQ arama
function findBestFaqMatch(message: string): { faq: HelinFaqItem | null, score: number } {
  let bestMatch: HelinFaqItem | null = null;
  let maxScore = 0;

  // Kısa mesajlarda greeting kontrolü
  if (message.length < 20) {
    const greetingFaq = (faqData as HelinFaqItem[]).find(f => f.id === 'faq-greeting');
    if (greetingFaq) {
      const isGreeting = greetingFaq.keywords.some(k => normalize(message) === normalize(k));
      if (isGreeting) return { faq: greetingFaq, score: 1 };
    }
  }

  for (const item of (faqData as HelinFaqItem[])) {
    const normalizedMsg = normalize(message);
    const matchedKeywords = item.keywords.filter(k => normalizedMsg.includes(normalize(k)));
    
    if (matchedKeywords.length > 0) {
      const currentScore = matchedKeywords.length * 10;
      if (currentScore > maxScore) {
        maxScore = currentScore;
        bestMatch = item;
      }
    }
  }

  return { faq: bestMatch, score: maxScore };
}

// Intent tespiti (V1.1.1: İsim ve handoff kontrolü düzeltildi)
function detectIntent(
  message: string, 
  faqId?: string, 
  session?: HelinSessionContext,
  detectedName?: string | null,
  detectedService?: HelinService | null
): HelinIntent {
  const normalizedMsg = normalize(message);

  // V1.1.1: İsim yakalama varsa, ASLA handoff/unknown dönme
  if (detectedName) {
    // Sadece isim mesajıysa greeting gibi davran
    if (isOnlyNameMessage(message, detectedName)) {
      return 'greeting'; // veya 'name_update' ama şimdilik greeting
    }
  }

  // 1. Greeting
  if (faqId === 'faq-greeting') return 'greeting';
  
  // 2. Price needs service
  const priceKeywords = ['fiyat', 'ucret', 'kac para', 'ne kadar'];
  const hasPriceRequest = priceKeywords.some(k => normalizedMsg.includes(k));
  
  if (hasPriceRequest && !faqId) {
    return 'price_needs_service';
  }

  // 3. Sales FAQ
  if (faqId) return 'sales_faq';

  // 4. Handoff (V1.1.1: Daha sıkı kontrol)
  // İsim pattern'leri varsa handoff'a düşme
  const hasNamePattern = /ismim|ben\s|adim|adım/.test(normalizedMsg);
  if (hasNamePattern) {
    return 'greeting'; // İsim içeren mesajlar greeting olsun
  }

  const technicalKeywords = ['hata', 'giremiyorum', 'calismıyor', 'calismiyor', 'problem', 'sorun', 'bug', 'sikinti', 'sıkıntı', 'bozuk'];
  const hasTechnicalIssue = technicalKeywords.some(k => normalizedMsg.includes(k));
  
  if (hasTechnicalIssue) {
    return 'handoff';
  }

  // 5. Unknown
  return 'unknown';
}

// V1.1.1: Servis bazlı fiyat açıklaması
function getServicePriceInfo(service: HelinService, userName?: string): string {
  const prefix = userName ? `${userName} Bey, ` : '';
  
  switch (service) {
    case 'evlilik-teklifi':
      return `${prefix}evlilik teklifi organizasyonlarımız için fiyatlarımız paketin içeriğine göre değişmektedir. Özel süslemeler, yemek, müzik gibi seçeneklere göre 15.000 TL'den başlayan paketlerimiz var. Size özel bir teklif hazırlayabiliriz.`;
    
    case 'dogum-gunu':
      return `${prefix}doğum günü kutlamalarımız için fiyatlarımız kişi sayısı ve özel isteklere göre değişmektedir. Genellikle 8.000 TL'den başlayan paketlerimiz mevcuttur.`;
    
    case 'yat-turu':
      return `${prefix}yat turları için fiyatlarımız seçtiğiniz tekneye, kişi sayısına ve tur süresine göre değişmektedir. Yarım günlük turlar 3.000 TL'den, tam günlük turlar ise 5.000 TL'den başlamaktadır.`;
    
    default:
      return `${prefix}fiyatlarımız seçtiğiniz hizmete göre değişmektedir.`;
  }
}

// ============================================
// MAIN ENGINE FUNCTION
// ============================================

export async function processHelinMessage(request: HelinEngineRequest): Promise<HelinEngineResult> {
  const { message, session, productContext } = request;
  
  // Default session
  const currentSession: HelinSessionContext = session || {
    mode: 'INFO',
    greetingCount: 0,
    handoffCount: 0
  };

  // Session patch (güncellemeler burada toplanacak)
  const sessionPatch: Partial<HelinSessionContext> = {};

  // 1. İsim yakalama (V1.1.1: Her zaman override et)
  const detectedName = extractUserName(message);
  if (detectedName) {
    sessionPatch.userName = detectedName; // Override, eski isim önemli değil
  }

  // 2. Servis yakalama
  const detectedService = extractService(message);
  if (detectedService) {
    sessionPatch.selectedService = detectedService;
  }

  // 3. Product context kontrolü
  if (productContext?.slug) {
    const product = (productData as HelinProduct[]).find(p => p.slug === productContext.slug);
    if (product) {
      const normalizedMsg = normalize(message);
      if (normalizedMsg.includes('fiyat') || normalizedMsg.includes('ucret')) {
        return {
          reply: `"${product.name}" için fiyatımız ${product.price} ${product.currency}. Detaylı bilgi almak ister misiniz?`,
          intent: 'product_info',
          needsHuman: false,
          sessionPatch
        };
      }
    }
  }

  // 4. FAQ arama
  const { faq, score } = findBestFaqMatch(message);
  const threshold = 5;
  const isMatch = score >= threshold || (faq?.id === 'faq-greeting');

  // 5. Intent tespiti (V1.1.1: detectedName ve detectedService gönder)
  let intent = detectIntent(message, isMatch ? faq?.id : undefined, currentSession, detectedName, detectedService);

  // 6. Cevap üretimi (stateful mantık)
  let reply = '';
  let needsHuman = false;

  const userName = sessionPatch.userName || currentSession.userName;
  const userNamePrefix = userName ? `${userName} Bey` : '';
  
  // V1.1.1: Güncel servis (yeni yakalanan veya mevcut)
  const currentService = sessionPatch.selectedService || currentSession.selectedService;

  switch (intent) {
    case 'greeting': {
      const greetingCount = (currentSession.greetingCount || 0) + 1;
      sessionPatch.greetingCount = greetingCount;

      // V1.1.1: Sadece isim mesajı mı?
      if (detectedName && isOnlyNameMessage(message, detectedName)) {
        reply = `Memnun oldum ${detectedName} Bey, size nasıl yardımcı olabilirim?`;
        break;
      }

      if (greetingCount === 1) {
        // İlk selamlama: uzun intro
        reply = faq?.answer || "Merhaba! Ben Helin, Yatta'nın dijital satış asistanıyım. Size yat kiralama, turlar veya organizasyonlar konusunda nasıl yardımcı olabilirim?";
        
        // Servis seçilmemişse sor
        if (!currentService) {
          reply += "\n\nHangi hizmetimiz için bilgi almak istiyorsunuz? (Evlilik teklifi / Doğum günü / Yat turu)";
        }
      } else {
        // Tekrar selamlama: kısa cevap + isimle hitap
        if (userNamePrefix) {
          reply = `Merhaba ${userNamePrefix}! Size nasıl yardımcı olabilirim?`;
        } else {
          reply = "Tekrar merhaba! Size nasıl yardımcı olabilirim?";
        }
      }
      break;
    }

    case 'sales_faq': {
      reply = faq?.answer || "Bunu tam anlayamadım.";
      
      // İsimle kişiselleştir (cevabın başına ekle)
      if (userNamePrefix && reply) {
        reply = `${userNamePrefix}, ${reply.charAt(0).toLowerCase()}${reply.slice(1)}`;
      }
      break;
    }

    case 'price_needs_service': {
      // V1.1.1: Servis varsa ona göre cevap ver
      if (currentService) {
        reply = getServicePriceInfo(currentService, userName);
        intent = 'sales_faq'; // Intent düzelt
      } else {
        // Servis yoksa genel cevap + yönlendirme
        const priceFaq = (faqData as HelinFaqItem[]).find(f => f.id === 'faq-price-general');
        reply = priceFaq?.answer || "Fiyatlarımız hizmete göre değişmektedir.";
        reply += "\n\nHangi hizmetimiz için fiyat bilgisi almak istersiniz? (Evlilik teklifi / Doğum günü / Yat turu)";
        intent = 'sales_faq';
      }
      break;
    }

    case 'handoff': {
      // V1.1.1: Handoff kontrolü düzeltildi
      const isFirstHandoff = currentSession.mode !== 'HUMAN_HANDOFF' && (currentSession.handoffCount || 0) === 0;
      
      const handoffCount = (currentSession.handoffCount || 0) + 1;
      sessionPatch.handoffCount = handoffCount;

      if (isFirstHandoff) {
        // İlk handoff (uzun)
        reply = "Bu konuda size tam yanıt veremiyorum, ancak sizi müşteri temsilcimize yönlendirebilirim. WhatsApp üzerinden 0530 487 23 33 numarasından veya web sitemizden iletişim bilgilerinizi bırakarak size dönüş yapılmasını sağlayabilirsiniz.";
        sessionPatch.mode = 'HUMAN_HANDOFF';
      } else {
        // Tekrar handoff (kısa)
        reply = "Talebinizi canlı temsilcimize ilettim, en kısa sürede size dönüş yapılacak. Bu arada adınızı ve telefonunuzu da bırakabilirsiniz.";
      }
      
      needsHuman = true;
      break;
    }

    case 'unknown':
    default: {
      // V1.1.1: Unknown da handoff gibi ama daha soft
      const handoffCount = (currentSession.handoffCount || 0) + 1;
      sessionPatch.handoffCount = handoffCount;

      if (handoffCount > 1 || currentSession.mode === 'HUMAN_HANDOFF') {
        reply = "Size yardımcı olamıyorum, lütfen müşteri temsilcimizle iletişime geçin.";
      } else {
        reply = "Bu konuda size tam yanıt veremiyorum, ancak sizi müşteri temsilcimize yönlendirebilirim veya iletişim bilgilerinizi bırakırsanız size dönüş yapabiliriz.";
        sessionPatch.mode = 'HUMAN_HANDOFF';
      }
      
      intent = 'handoff';
      needsHuman = true;
      break;
    }
  }

  return {
    reply,
    intent,
    needsHuman,
    matchedFaqId: isMatch ? faq?.id : undefined,
    sessionPatch: Object.keys(sessionPatch).length > 0 ? sessionPatch : undefined
  };
}
