// admin-panel/src/app/api/community/threads/[id]/replies/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';
import { queryAzureLightRag } from '@/lib/services/lightrag';

function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not configured");
  return neon(databaseUrl);
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
        role: 'ADVOCATE',
      };
    }

    const body = await request.json();
    const { body: content } = body;

    if (!content || typeof content !== 'string' || content.trim().length < 2) {
      return NextResponse.json({ error: 'Reply text cannot be empty' }, { status: 400 });
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
        ${user.id || 'usr_adv_01'},
        ${user.name || 'Advocate'},
        ${user.role || 'ADVOCATE'},
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

    const newReply = inserted[0];

    // Detect if user tagged @ai or @hayagriva
    if (/@(ai|hayagriva|bot)/i.test(content)) {
      triggerContextualAiReply(threadId, content).catch((err) => {
        console.error('[Community API] Follow-up AI trigger failed:', err);
      });
    }

    return NextResponse.json({ reply: newReply }, { status: 201 });
  } catch (error: any) {
    console.error('[Community API] Failed to add reply:', error);
    return NextResponse.json({ error: error?.message || 'Failed to add reply' }, { status: 500 });
  }
}
