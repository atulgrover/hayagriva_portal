// admin-panel/src/app/api/community/threads/[id]/ai-retry/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { queryAzureLightRag } from '@/lib/services/lightrag';

function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not configured");
  return neon(databaseUrl);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: threadId } = await params;
    const sql = getDb();

    const threads = await sql`SELECT * FROM community_threads WHERE id = ${threadId} LIMIT 1`;
    if (!threads || threads.length === 0) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    const thread = threads[0];
    await sql`UPDATE community_threads SET ai_status = 'PENDING' WHERE id = ${threadId}`;

    const query = `${thread.title}\n\n${thread.body}`;
    const result = await queryAzureLightRag(query);

    const isSuccess = result.status === 'SUCCESS';
    const replyId = `rep_${Math.random().toString(36).substring(2, 9)}${Date.now().toString(36)}`;

    const insertedReply = await sql`
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
      RETURNING *
    `;

    await sql`
      UPDATE community_threads
      SET has_ai_answer = true,
          ai_status = ${isSuccess ? 'COMPLETED' : 'FAILED'},
          reply_count = reply_count + 1,
          updated_at = now()
      WHERE id = ${threadId}
    `;

    return NextResponse.json(
      { reply: insertedReply[0], status: result.status },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Community API] AI retry failed:', error);
    return NextResponse.json({ error: error?.message || 'AI retry failed' }, { status: 500 });
  }
}
