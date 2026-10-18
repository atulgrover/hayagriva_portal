// admin-panel/src/app/api/user/keys/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { generateMcpBearerToken } from '@/lib/security/tokens';
import { ApiKey } from '@/lib/db/schema';
import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';

export async function GET(request: Request) {
  try {
    const cookieVal = getCookieValue(request.headers.get('cookie'), 'hayagriva_user');
    let userId = 'usr_adv_01'; // Default fallback

    if (cookieVal) {
      const parsed = safeParseJsonCookie(cookieVal);
      if (parsed?.id) userId = parsed.id;
    }

    const store = getMockStore();
    const userKeys = store.apiKeys.filter(k => k.userId === userId);

    return NextResponse.json({ keys: userKeys, total: userKeys.length }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    const cookieVal = getCookieValue(request.headers.get('cookie'), 'hayagriva_user');
    let userId = 'usr_adv_01';

    if (cookieVal) {
      const parsed = safeParseJsonCookie(cookieVal);
      if (parsed?.id) userId = parsed.id;
    }

    const { rawToken, keyPrefix, keyHash } = generateMcpBearerToken();

    const newKey: ApiKey = {
      id: `key_mcp_${Date.now()}`,
      userId,
      activationId: null,
      name: name || 'Cloud Agent MCP Key',
      keyPrefix,
      keyHash,
      scopes: ['mcp:agent:read', 'mcp:agent:exec', 'mcp:vault:query'],
      isActive: true,
      createdAt: new Date(),
      lastUsedAt: null,
    };

    const store = getMockStore();
    store.apiKeys.push(newKey);

    return NextResponse.json({ success: true, apiKey: newKey, rawToken }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to generate key' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { keyId } = await request.json();
    const store = getMockStore();

    const key = store.apiKeys.find(k => k.id === keyId);
    if (!key) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    key.isActive = false;

    return NextResponse.json({ success: true, key }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to revoke key' }, { status: 500 });
  }
}
