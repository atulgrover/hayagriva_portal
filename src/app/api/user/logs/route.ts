// admin-panel/src/app/api/user/logs/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';

export async function GET(request: Request) {
  try {
    const cookieVal = getCookieValue(request.headers.get('cookie'), 'hayagriva_user');
    let userId = 'usr_adv_01'; // Default fallback

    if (cookieVal) {
      const parsed = safeParseJsonCookie(cookieVal);
      if (parsed?.id) userId = parsed.id;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const method = searchParams.get('method') || 'ALL';

    const store = getMockStore();
    let logs = store.systemLogs.filter(l => l.userId === userId);

    if (method !== 'ALL') {
      logs = logs.filter(l => l.method === method);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      logs = logs.filter(l => l.endpoint.toLowerCase().includes(q));
    }

    return NextResponse.json({ logs, total: logs.length }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch logs' }, { status: 500 });
  }
}
