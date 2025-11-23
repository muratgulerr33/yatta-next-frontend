export type HelinIntent = 
  | 'greeting' 
  | 'price_needs_service' 
  | 'sales_faq' 
  | 'product_info' 
  | 'handoff' 
  | 'unknown';

// V1.1: Helin'in çalışma modları
export type HelinMode = 'INFO' | 'RESERVATION_COLLECTING' | 'HUMAN_HANDOFF';

// V1.1: Hizmet tipleri
export type HelinService = 'evlilik-teklifi' | 'dogum-gunu' | 'yat-turu';

// V1.1: Session context - Helin'in kullanıcıyı hatırlaması için
export interface HelinSessionContext {
  mode: HelinMode;
  userName?: string;
  selectedService?: HelinService;
  reservationDraft?: {
    date?: string;
    time?: string;
    people?: number;
    phone?: string;
  };
  greetingCount?: number; // Kaç kere selamlaştığımızı sayar
  handoffCount?: number; // Kaç kere handoff mesajı verdik
}

// V1.1: Engine'e gönderilecek request yapısı
export interface HelinEngineRequest {
  message: string;
  session?: HelinSessionContext;
  productContext?: {
    slug?: string;
    id?: string;
  };
}

// V1.1: Engine'den dönecek sonuç yapısı
export interface HelinEngineResult {
  reply: string;
  intent: HelinIntent;
  needsHuman: boolean;
  matchedFaqId?: string;
  sessionPatch?: Partial<HelinSessionContext>; // Session'da güncellenecek alanlar
}

export interface HelinFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

export interface HelinProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price?: number;
  currency?: string;
  capacity?: number;
  description?: string;
}

export interface HelinMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  content: string;
  timestamp: number;
  intent?: HelinIntent;
  metadata?: Record<string, any>;
}

export interface HelinChatRequest {
  sessionId: string;
  message: string;
  sessionContext?: HelinSessionContext; // V1.1: Session bilgisini API'ye taşı
  productContext?: {
    slug?: string;
    id?: string;
  };
}

export interface HelinChatResponse {
  reply: string;
  intent: HelinIntent;
  matchedFaqId?: string;
  needsHuman: boolean;
  sessionPatch?: Partial<HelinSessionContext>; // V1.1: Güncellenecek session alanları
  products?: HelinProduct[];
}

export interface HelinLogEntry {
  sessionId: string;
  timestamp: string;
  from: 'user' | 'bot';
  message: string;
  intent?: string;
  matchedFaqId?: string;
}

