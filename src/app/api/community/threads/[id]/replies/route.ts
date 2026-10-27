// admin-panel/src/app/api/community/threads/[id]/replies/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';
import { queryAzureLightRag } from '@/lib/services/lightrag';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

// Background handler for contextual follow-up @ai queries
async function triggerContextualAiReply(threadId: string, userQuery: string) {
  try {
    const sql = getDb();
    const pastReplies = await sql`
      SELECT author_role, is_ai_generated, body
      FROM community_replies
      WHERE thread_id = ${threadId}
      ORDER BY created_at ASC
      LIMIT 6
    `;

    const conversationHistory = pastReplies.map((r: any) => ({
      role: r.is_ai_generated ? 'assistant' : 'user',
      content: r.body,
    }));

    const result = await queryAzureLightRag(userQuery, conversationHistory);
    const replyId = `rep_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

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
      SET reply_count = reply_count + 1,
          updated_at = now()
      WHERE id = ${threadId}
    `;
    console.log(`[Community API] Follow-up AI reply saved for thread ${threadId}`);
  } catch (err: any) {
    console.error(`[Community API] Error generating contextual AI reply:`, err);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: threadId } = await params;
    const cookieVal = getCookieValue(request.headers.get('cookie'), 'hayagriva_user');
    let user = cookieVal ? safeParseJsonCookie(cookieVal) : null;

    if (!user) {
      user = {
        id: 'usr_guest_adv',
        name: 'Guest Practitioner',
        role: 'GUEST',
      };
    }

    const body = await request.json();
    const { body: content } = body;

    if (!content || typeof content !== 'string' || content.trim().length < 2) {
      return NextResponse.json({ error: 'Reply text cannot be empty' }, { status: 400, headers: corsHeaders });
    }

    const sql = getDb();
    const replyId = `rep_${Math.random().toString(36).substring(2, 9)}${Date.now().toString(36)}`;

    const inserted = await sql`
      INSERT INTO community_replies (
        id, thread_id, author_id, author_name, author_role, author_avatar,
        body, is_ai_generated, ai_citations, upvotes, created_at
      ) VALUES (
        ${replyId},
        ${threadId},
        ${user.id || 'usr_guest_adv'},
        ${user.name || 'Guest Practitioner'},
        ${user.role || 'GUEST'},
        ${user.avatarUrl || null},
        ${content.trim()},
        false,
        '[]'::jsonb,
        0,
        now()
      )
      RETURNING *
    `;

    await sql`
      UPDATE community_threads
      SET reply_count = reply_count + 1,
          updated_at = now()
      WHERE id = ${threadId}
    `;

    // Check if reply explicitly requests AI follow-up via @ai or @bot
    if (content.toLowerCase().includes('@ai') || content.toLowerCase().includes('@bot')) {
      const cleanPrompt = content.replace(/@ai|@bot/gi, '').trim();
      triggerContextualAiReply(threadId, cleanPrompt).catch((err) => {
        console.error('[Community API] Contextual AI reply failed:', err);
      });
    }

    return NextResponse.json({ reply: inserted[0] }, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    console.error('[Community API] Failed to post reply:', error);
    return NextResponse.json({ error: error?.message || 'Failed to post reply' }, { status: 500, headers: corsHeaders });
  }
}
