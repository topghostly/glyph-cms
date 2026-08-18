import { NextResponse } from "next/server";
import dbConnect from "@/lib/db-connect";
import Blog from "@/models/blog";
import User from "@/models/user";
import { withValidation } from "@/lib/api-handler";
import { localIdSchema } from "@/lib/schemas";

/**
 * Intentionally public — this backs the public permalink page.
 * Returns only the creator's display fields, never their email.
 */
export const POST = withValidation(localIdSchema, async (body) => {
  await dbConnect();

  const blog = await Blog.findOne({ _localID: body._localID }).lean<{
    _localID: string;
    content: string;
    creator: string;
    link: string;
  } | null>();

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  const creator = await User.findById(blog.creator)
    .select("fullname image")
    .lean<{ fullname: string; image: string } | null>();

  return NextResponse.json(
    {
      blog,
      creator: creator
        ? { fullname: creator.fullname, image: creator.image }
        : null,
    },
    { status: 200 }
  );
});
