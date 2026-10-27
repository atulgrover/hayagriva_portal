// admin-panel/src/app/api/community/threads/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { queryAzureLightRag } from '@/lib/services/lightrag';
import { checkGuestRateLimit, incrementGuestRateLimit } from '@/lib/services/rate-limiter';
import { verifyTurnstileToken } from '@/lib/services/turnstile';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
        '/branding/unicorn_emblem.png',
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
      { status: 200, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('[Community API] Failed to fetch threads:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch threads' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const clientIp = forwardedFor.split(",")[0].trim();

    const body = await request.json();
    const { title, body: content, category = "insolvency-ibc", tags = [], turnstileToken, authorName } = body;

    // 1. Turnstile Bot Check
    const isHuman = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Bot verification failed. Please refresh and try again." },
        { status: 403, headers: corsHeaders }
      );
    }

    // 2. 3 Questions / Day Guest Rate Limit Check
    const rateLimit = await checkGuestRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "DAILY_LIMIT_REACHED",
          message: "You have reached your 3 free questions for today. Please sign in to continue asking unlimited questions.",
          resetAt: rateLimit.resetAt,
        },
        { status: 429, headers: corsHeaders }
      );
    }

    if (!title || typeof title !== "string" || title.trim().length < 5) {
      return NextResponse.json({ error: "Title must be at least 5 characters" }, { status: 400, headers: corsHeaders });
    }
    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return NextResponse.json({ error: "Body must be at least 10 characters" }, { status: 400, headers: corsHeaders });
    }

    const sql = getDb();
    const threadId = `th_${Math.random().toString(36).substring(2, 9)}${Date.now().toString(36)}`;

    const inserted = await sql`
      INSERT INTO community_threads (
        id, title, body, author_id, author_name, author_role, author_avatar,
        category, origin_domain, tags, is_pinned, is_locked, has_ai_answer, ai_status, reply_count, views_count, created_at, updated_at
      ) VALUES (
        ${threadId},
        ${title.trim()},
        ${content.trim()},
        'guest_user',
        ${authorName?.trim() || 'Guest Practitioner'},
        'GUEST',
        null,
        ${category},
        'agenticprofessionals',
        ${JSON.stringify(tags)}::jsonb,
        false,
        false,
        false,
        'QUEUED',
        0,
        0,
        now(),
        now()
      )
      RETURNING *
    `;

    // Increment guest question count
    await incrementGuestRateLimit(clientIp);

    const newThread = inserted[0];

    // Trigger Azure LightRAG asynchronously in background
    triggerAiBotForThread(threadId, title, content).catch((err) => {
      console.error("[Community API] Background AI trigger failed:", err);
    });

    return NextResponse.json(
      { thread: newThread, remaining: rateLimit.remaining - 1 },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[Community API] Failed to create thread:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create thread' }, { status: 500, headers: corsHeaders });
  }
}
