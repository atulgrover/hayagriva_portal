// admin-panel/src/app/api/community/threads/[id]/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Forwarded-For",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

function getDb() {
  const connectionString =
    process.env.SHARED_FORUM_DATABASE_URL_POOLED ||
    process.env.SHARED_FORUM_DATABASE_URL ||
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_hfx1TLRcS5aD@ep-curly-meadow-b30a75yb-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  return neon(connectionString);
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
      return NextResponse.json({ error: 'Thread not found' }, { status: 404, headers: corsHeaders });
    }

    const thread = threads[0];

    const replies = await sql`
      SELECT * FROM community_replies
      WHERE thread_id = ${id}
      ORDER BY is_ai_generated DESC, created_at ASC
    `;

    return NextResponse.json(
      { thread, replies },
      { status: 200, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('[Community API] Failed to fetch thread details:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch thread' }, { status: 500, headers: corsHeaders });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const sql = getDb();
    const threads = await sql`SELECT * FROM community_threads WHERE id = ${id} LIMIT 1`;
    if (!threads || threads.length === 0) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404, headers: corsHeaders });
    }

    const thread = threads[0];
    const isAuthor = thread.author_id === user.id;
    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: corsHeaders });
    }

    await sql`DELETE FROM community_replies WHERE thread_id = ${id}`;
    await sql`DELETE FROM community_threads WHERE id = ${id}`;

    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete thread' }, { status: 500, headers: corsHeaders });
  }
}
