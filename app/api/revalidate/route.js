// app/api/revalidate/route.js

import { revalidatePath } from 'next/cache';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');

    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response(JSON.stringify({ message: 'Invalid secret' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!path) {
      return new Response(JSON.stringify({ message: 'Path is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    revalidatePath(path);

    return new Response(JSON.stringify({ revalidated: true, path }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

