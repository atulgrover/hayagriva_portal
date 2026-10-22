// admin-panel/src/app/api/community/threads/[id]/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';

function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not configured");
  return neon(databaseUrl);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDb();

    // Increment view count in background
    sql`UPDATE community_threads SET views_count = views_count + 1 WHERE id = ${id}`.catch(() => {});

    const threads = await sql`
      SELECT * FROM community_threads WHERE id = ${id} LIMIT 1
    `;

    if (!threads || threads.length === 0) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    const thread = threads[0];

    const replies = await sql`
      SELECT * FROM community_replies
      WHERE thread_id = ${id}
      ORDER BY is_ai_generated DESC, created_at ASC
    `;

    return NextResponse.json(
      { thread, replies },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('[Community API] Failed to fetch thread details:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch thread' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieVal = getCookieValue(request.headers.get('cookie'), 'hayagriva_user');
    const user = cookieVal ? safeParseJsonCookie(cookieVal) : null;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getDb();
    const threads = await sql`SELECT * FROM community_threads WHERE id = ${id} LIMIT 1`;
    if (!threads || threads.length === 0) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    const thread = threads[0];
    const isAuthor = thread.author_id === user.id;
    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await sql`DELETE FROM community_replies WHERE thread_id = ${id}`;
    await sql`DELETE FROM community_threads WHERE id = ${id}`;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete thread' }, { status: 500 });
  }
}
