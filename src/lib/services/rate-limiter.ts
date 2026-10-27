import crypto from "node:crypto";
import { sharedDb, communityGuestRateLimits } from "../db/shared-forum";
import { eq, sql } from "drizzle-orm";

const MAX_FREE_DAILY_QUESTIONS = 3;

export function hashIp(ip: string): string {
  const salt = process.env.SESSION_SECRET || "resolution_bazaar_guest_salt_2026";
  return crypto.createHmac("sha256", salt).update(ip).digest("hex");
}

export async function checkGuestRateLimit(rawIp: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}> {
  const ipHash = hashIp(rawIp);
  const now = new Date();

  const [record] = await sharedDb
    .select()
    .from(communityGuestRateLimits)
    .where(eq(communityGuestRateLimits.ipHash, ipHash));

  if (!record || record.expiresAt < now) {
    const nextReset = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return {
      allowed: true,
      remaining: MAX_FREE_DAILY_QUESTIONS,
      resetAt: nextReset,
    };
  }

  const remaining = Math.max(0, MAX_FREE_DAILY_QUESTIONS - record.questionCount);
  return {
    allowed: record.questionCount < MAX_FREE_DAILY_QUESTIONS,
    remaining,
    resetAt: record.expiresAt,
  };
}

export async function incrementGuestRateLimit(rawIp: string): Promise<void> {
  const ipHash = hashIp(rawIp);
  const now = new Date();
  const resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [existing] = await sharedDb
    .select()
    .from(communityGuestRateLimits)
    .where(eq(communityGuestRateLimits.ipHash, ipHash));

  if (!existing || existing.expiresAt < now) {
    await sharedDb
      .insert(communityGuestRateLimits)
      .values({
        ipHash,
        questionCount: 1,
        lastQuestionAt: now,
        expiresAt: resetAt,
      })
      .onConflictDoUpdate({
        target: communityGuestRateLimits.ipHash,
        set: {
          questionCount: 1,
          lastQuestionAt: now,
          expiresAt: resetAt,
        },
      });
  } else {
    await sharedDb
      .update(communityGuestRateLimits)
      .set({
        questionCount: sql`${communityGuestRateLimits.questionCount} + 1`,
        lastQuestionAt: now,
      })
      .where(eq(communityGuestRateLimits.ipHash, ipHash));
  }
}
