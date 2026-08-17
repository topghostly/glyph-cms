import { NextRequest, NextResponse } from "next/server";
import type { ZodTypeAny, output } from "zod";
import { auth } from "@/auth";
import type { Session } from "next-auth";

/* ---------------------------------------------------------------- *
 * Rate limiting (in-memory, per instance).
 * Swap `hits` for Redis if this ever runs multi-region.
 * ---------------------------------------------------------------- */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;

export function rateLimit(id: string): boolean {
  const now = Date.now();
  const rec = hits.get(id);

  if (!rec || now > rec.resetAt) {
    hits.set(id, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (rec.count >= MAX_PER_WINDOW) return false;

  rec.count += 1;
  return true;
}

/**
 * Wraps a route handler with: session check -> rate limit -> body validation.
 * The handler receives the parsed body and the verified session.
 */
export function withAuth<S extends ZodTypeAny>(
  schema: S,
  handler: (body: output<S>, session: Session) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!rateLimit(session.user.id)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    try {
      return await handler(parsed.data, session);
    } catch (err) {
      console.error("[api]", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  };
}

/** Same as `withAuth` but for intentionally public routes. */
export function withValidation<S extends ZodTypeAny>(
  schema: S,
  handler: (body: output<S>) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    try {
      return await handler(parsed.data);
    } catch (err) {
      console.error("[api]", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  };
}
