import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Blog from "@/models/blog";
import { withAuth } from "@/lib/api-handler";
import { blogUploadSchema } from "@/lib/schemas";

export const POST = withAuth(blogUploadSchema, async (body, session) => {
  await dbConnect();

  const existing = await Blog.findOne({ _localID: body._localID })
    .select("creator")
    .lean<{ creator: string } | null>();

  // Someone else already owns this _localID — refuse to overwrite.
  if (existing && existing.creator !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const blog = await Blog.findOneAndUpdate(
    { _localID: body._localID },
    {
      content: body.content,
      link: body.link,
      creator: session.user.id,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return NextResponse.json({ message: "Saved", blog }, { status: 200 });
});
