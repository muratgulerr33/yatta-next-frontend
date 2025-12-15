import { request } from "../api";

export interface LivekitTokenRequest {
  conversation_id: number;
  call_type: "audio" | "video";
  call_id?: string;
}

export interface LivekitTokenResponse {
  livekit_url: string;
  room: string;
  token: string;
  identity: string;
  call_type: "audio" | "video";
}

/**
 * LiveKit Access Token alır
 */
export async function getLivekitToken(
  params: LivekitTokenRequest
): Promise<LivekitTokenResponse> {
  const data = await request<LivekitTokenResponse>(
    "/api/v1/rtc/livekit/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      credentials: "include", // Cookie JWT için gerekli
    }
  );
  return data;
}




