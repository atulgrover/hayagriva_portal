// admin-panel/src/app/api/user/support/route.ts
import { NextResponse } from 'next/server';
import { getMockStore } from '@/lib/db/seed';
import { SupportTicket } from '@/lib/db/schema';
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
    const tickets = store.supportTickets.filter(t => t.userId === userId);

    return NextResponse.json({ tickets, total: tickets.length }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, priority, description } = body;

    const cookieVal = getCookieValue(request.headers.get('cookie'), 'hayagriva_user');

    let userId = 'usr_adv_01';
    let userName = 'Adv. Rajeshwar Rao';
    let userEmail = 'r.rao@insolvencylaw.in';

    if (cookieVal) {
      const parsed = safeParseJsonCookie(cookieVal);
      if (parsed?.id) userId = parsed.id;
      if (parsed?.name) userName = parsed.name;
      if (parsed?.email) userEmail = parsed.email;
    }

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      userName,
      userEmail,
      subject: subject || 'Support Request',
      description: description || '',
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      adminResponse: null,
      respondedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const store = getMockStore();
    store.supportTickets.push(newTicket);

    return NextResponse.json({ success: true, ticket: newTicket }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to submit ticket' }, { status: 500 });
  }
}
