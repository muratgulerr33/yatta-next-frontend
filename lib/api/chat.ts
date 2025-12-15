import { request, PaginatedResponse } from "../api";

export interface Conversation {
  id: number;
  participants: Array<{
    id: number;
    username: string;
    email: string;
  }>;
  created_at: string;
  updated_at: string;
  last_message?: Message | null;
  last_message_at?: string | null;
}

export interface Message {
  id: number;
  conversation: number;
  sender: {
    id: number;
    username: string;
    email: string;
  };
  text: string;
  created_at: string;
  read_at: string | null;
}

export async function getConversations(): Promise<Conversation[]> {
  const data = await request<PaginatedResponse<Conversation> | Conversation[]>(
    "/api/v1/chat/conversations/"
  );
  
  // Eğer paginated response ise (results key'i varsa)
  if (data && typeof data === 'object' && 'results' in data) {
    return (data as PaginatedResponse<Conversation>).results;
  }
  
  // Eğer direkt dizi ise
  if (Array.isArray(data)) {
    return data;
  }
  
  // Diğer durumlarda boş dizi
  return [];
}

export async function getMessages(conversationId: number): Promise<Message[]> {
  const data = await request<PaginatedResponse<Message> | Message[]>(
    `/api/v1/chat/messages/?conversation=${conversationId}`
  );

  // DRF hem array hem paginated obje dönebilir; normalize et
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object' && 'results' in data) {
    return (data as PaginatedResponse<Message>).results;
  }

  // Beklenmedik durumda bile her zaman array dön
  return [];
}

export async function startOrGetConversation(
  targetUserId: number
): Promise<Conversation> {
  const data = await request<Conversation>(
    "/api/v1/chat/conversations/start-or-get/",
    {
      method: "POST",
      body: JSON.stringify({ target_user_id: targetUserId }),
    }
  );
  return data;
}

export async function sendMessage(
  conversationId: number,
  text: string
): Promise<Message> {
  const data = await request<Message>("/api/v1/chat/messages/", {
    method: "POST",
    body: JSON.stringify({
      conversation: conversationId,
      text: text,
    }),
  });
  return data;
}

export function getChatWsUrl(conversationId: number): string {
  // Protocol: https -> wss, http -> ws
  const protocol = typeof window !== 'undefined' && window.location.protocol === "https:" ? "wss" : "ws";
  
  // Host: env var veya window.location.hostname
  // Local development için 127.0.0.1 kullan
  const host = process.env.NEXT_PUBLIC_API_WS_HOST || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? '127.0.0.1' 
      : (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'));
  
  // Port: env var veya default
  const port = process.env.NEXT_PUBLIC_API_WS_PORT || "8000";
  
  const url = `${protocol}://${host}:${port}/ws/chat/${conversationId}/`;
  console.log(`[WS] Connecting to: ${url}`);
  return url;
}

export function getInboxWsUrl(): string {
  // Protocol: https -> wss, http -> ws
  const protocol = typeof window !== 'undefined' && window.location.protocol === "https:" ? "wss" : "ws";
  
  // Host: env var veya window.location.hostname
  // Local development için 127.0.0.1 kullan
  const host = process.env.NEXT_PUBLIC_API_WS_HOST || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? '127.0.0.1' 
      : (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'));
  
  // Port: env var veya default
  // Prod'da reverse proxy kullanılıyorsa port olmayabilir
  const port = process.env.NEXT_PUBLIC_API_WS_PORT || "8000";
  
  // Prod'da yatta.com.tr üzerinden reverse proxy ile bağlanıyorsa port yok
  const url = port && host !== 'yatta.com.tr' && !host.includes('yatta.com.tr')
    ? `${protocol}://${host}:${port}/ws/chat/inbox/`
    : `${protocol}://${host}/ws/chat/inbox/`;
  
  console.log(`[INBOX WS] Connecting to: ${url}`);
  return url;
}
