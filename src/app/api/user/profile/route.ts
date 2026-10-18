// admin-panel/src/app/api/user/profile/route.ts
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

    const store = getMockStore();
    const user = store.users.find(u => u.id === userId) || store.users[1];

    return NextResponse.json({ user }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, org } = body;

    const cookieVal = getCookieValue(request.headers.get('cookie'), 'hayagriva_user');
    let userId = 'usr_adv_01';

    if (cookieVal) {
      const parsed = safeParseJsonCookie(cookieVal);
      if (parsed?.id) userId = parsed.id;
    }

    const store = getMockStore();
    const user = store.users.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name) user.name = name;
    if (org) user.org = org;
    user.updatedAt = new Date();

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update profile' }, { status: 500 });
  }
}
