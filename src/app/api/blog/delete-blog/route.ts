import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Blog from "@/models/blog";
import { withAuth } from "@/lib/api-handler";
import { localIdSchema } from "@/lib/schemas";

export const DELETE = withAuth(localIdSchema, async (body, session) => {
  await dbConnect();

  // `creator` in the filter is the authorization check: a post owned by
  // someone else simply matches nothing.
  const deleted = await Blog.findOneAndDelete({
    _localID: body._localID,
    creator: session.user.id,
  }).lean();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted" }, { status: 200 });
});
