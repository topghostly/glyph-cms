import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Blog from "@/models/blog";
import { withAuth } from "@/lib/api-handler";
import { listBlogsSchema } from "@/lib/schemas";

/**
 * Lists the signed-in author's own posts. The user id comes from the
 * session — it is never accepted from the request body, and there are no
 * open CORS headers.
 */
export const POST = withAuth(listBlogsSchema, async (body, session) => {
  await dbConnect();

  const blogs = await Blog.find({ creator: session.user.id })
    .sort({ updatedAt: -1 })
    .limit(body.limit)
    .select("_localID content link updatedAt")
    .lean();

  return NextResponse.json({ blogs }, { status: 200 });
});
