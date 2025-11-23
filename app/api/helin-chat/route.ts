import { NextResponse } from 'next/server';
import { processHelinMessage } from '@/lib/helin/helinEngine';
import { logHelinChat } from '@/lib/helin/logger';
import { HelinChatRequest, HelinEngineRequest } from '@/types/helin';

export async function POST(request: Request) {
  try {
    const body: HelinChatRequest = await request.json();
    
    if (!body.sessionId || !body.message) {
      return NextResponse.json(
        { error: 'Missing sessionId or message' },
        { status: 400 }
      );
    }

    // V1.1: Session context'i al (varsa)
    const sessionContext = body.sessionContext;

    // Debug log: Session bilgisini göster
    console.log('[HELIN-API] Session Context:', JSON.stringify({
      sessionId: body.sessionId,
      mode: sessionContext?.mode || 'INFO',
      userName: sessionContext?.userName || 'Bilinmiyor',
      selectedService: sessionContext?.selectedService || 'Seçilmedi',
      greetingCount: sessionContext?.greetingCount || 0,
      handoffCount: sessionContext?.handoffCount || 0
    }));

    // 1. Engine request hazırla
    const engineRequest: HelinEngineRequest = {
      message: body.message,
      session: sessionContext,
      productContext: body.productContext
    };

    // 2. Process Message through Helin Engine
    const response = await processHelinMessage(engineRequest);

    // Debug log: Engine response
    console.log('[HELIN-API] Engine Result:', JSON.stringify({
      intent: response.intent,
      needsHuman: response.needsHuman,
      sessionPatch: response.sessionPatch || 'No patch'
    }));

    // 3. Log Interactions
    // Log User Message
    await logHelinChat({
      sessionId: body.sessionId,
      timestamp: new Date().toISOString(),
      from: 'user',
      message: body.message,
    });

    // Log Bot Response
    await logHelinChat({
      sessionId: body.sessionId,
      timestamp: new Date().toISOString(),
      from: 'bot',
      message: response.reply,
      intent: response.intent,
      matchedFaqId: response.matchedFaqId
    });

    // 4. V1.1: sessionPatch ile response döndür
    return NextResponse.json({
      reply: response.reply,
      intent: response.intent,
      matchedFaqId: response.matchedFaqId,
      needsHuman: response.needsHuman,
      sessionPatch: response.sessionPatch || null // V1.1: Patch varsa döndür
    });

  } catch (error) {
    console.error('Helin API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
