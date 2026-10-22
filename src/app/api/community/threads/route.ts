// admin-panel/src/app/api/community/threads/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';
import { queryAzureLightRag } from '@/lib/services/lightrag';

function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not configured");
  return neon(databaseUrl);
}

// Background worker to query Azure LightRAG and insert the sovereign answer
async function triggerAiBotForThread(threadId: string, title: string, body: string) {
  try {
    const sql = getDb();
    const query = `${title}\n\n${body}`;
    const result = await queryAzureLightRag(query);

    const replyId = `rep_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const isSuccess = result.status === 'SUCCESS';

    await sql`
      INSERT INTO community_replies (
        id, thread_id, author_id, author_name, author_role, author_avatar, body, is_ai_generated, ai_citations, upvotes, created_at
      ) VALUES (
        ${replyId},
        ${threadId},
        'system_lightrag_bot',
        'Hayagriva Sovereign Bot',
        'AI_BOT',
        '/branding/hayagriva_medallion.png',
        ${result.answer},
        true,
        ${JSON.stringify(result.citations)}::jsonb,
        0,
        now()
      )
    `;

    await sql`
      UPDATE community_threads
      SET has_ai_answer = true,
          ai_status = ${isSuccess ? 'COMPLETED' : 'FAILED'},
          reply_count = reply_count + 1,
          updated_at = now()
      WHERE id = ${threadId}
    `;
    console.log(`[Community API] AI reply saved for thread ${threadId} (${result.status})`);
  } catch (err: any) {
    console.error(`[Community API] Error generating AI reply for thread ${threadId}:`, err);
    try {
      const sql = getDb();
      await sql`
        UPDATE community_threads
        SET ai_status = 'FAILED',
            updated_at = now()
        WHERE id = ${threadId}
      `;
    } catch {}
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 50);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const offset = (page - 1) * limit;

    const sql = getDb();

    let threads;
    if (category && category !== 'all' && search) {
      threads = await sql`
        SELECT * FROM community_threads
        WHERE category = ${category}
          AND (title ILIKE ${`%${search}%`} OR body ILIKE ${`%${search}%`})
        ORDER BY is_pinned DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (category && category !== 'all') {
      threads = await sql`
        SELECT * FROM community_threads
        WHERE category = ${category}
        ORDER BY is_pinned DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (search) {
      threads = await sql`
        SELECT * FROM community_threads
        WHERE title ILIKE ${`%${search}%`} OR body ILIKE ${`%${search}%`}
        ORDER BY is_pinned DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      threads = await sql`
        SELECT * FROM community_threads
        ORDER BY is_pinned DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const countResult = await sql`SELECT count(*) as total FROM community_threads`;
    const total = parseInt(countResult[0]?.total || '0', 10);

    return NextResponse.json(
      { threads, total, page, totalPages: Math.ceil(total / limit) },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('[Community API] Failed to fetch threads:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch threads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieVal = getCookieValue(request.headers.get('cookie'), 'hayagriva_user');
    let user = cookieVal ? safeParseJsonCookie(cookieVal) : null;

    if (!user) {
      user = {
        id: 'usr_guest_adv',
        name: 'Guest Practitioner',
        role: 'ADVOCATE',
      };
    }

    const body = await request.json();
    const { title, body: content, category = 'general', tags = [] } = body;

    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return NextResponse.json({ error: 'Title must be at least 5 characters' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      return NextResponse.json({ error: 'Body must be at least 10 characters' }, { status: 400 });
    }

    const sql = getDb();
    const threadId = `th_${Math.random().toString(36).substring(2, 9)}${Date.now().toString(36)}`;

    const inserted = await sql`
      INSERT INTO community_threads (
        id, title, body, author_id, author_name, author_role, author_avatar,
        category, tags, is_pinned, is_locked, has_ai_answer, ai_status, reply_count, views_count, created_at, updated_at
      ) VALUES (
        ${threadId},
        ${title.trim()},
        ${content.trim()},
        ${user.id || 'usr_adv_01'},
        ${user.name || 'Advocate'},
        ${user.role || 'ADVOCATE'},
        ${user.avatarUrl || null},
        ${category},
        ${JSON.stringify(tags)}::jsonb,
        false,
        false,
        false,
        'PENDING',
        0,
        0,
        now(),
        now()
      )
      RETURNING *
    `;

    const newThread = inserted[0];

    // Trigger Azure LightRAG asynchronously in background
    triggerAiBotForThread(threadId, title, content).catch((err) => {
      console.error('[Community API] Background AI trigger failed:', err);
    });

    return NextResponse.json({ thread: newThread }, { status: 201 });
  } catch (error: any) {
    console.error('[Community API] Failed to create thread:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create thread' }, { status: 500 });
  }
}
