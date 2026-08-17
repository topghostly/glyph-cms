import { cache } from "react";
import dbConnect from "@/lib/db-connect";
import Blog from "@/models/blog";
import User from "@/models/user";
import { BlogContentProp } from "@/type/blog";

export type PostCreator = { fullname: string; image: string } | null;

export type Post = {
  content: BlogContentProp;
  creator: PostCreator;
};

/**
 * Reads a post straight from Mongo. Wrapped in React `cache` so
 * `generateMetadata` and the page body share a single query per request
 * instead of each making its own HTTP round trip.
 */
export const getPost = cache(async (id: string): Promise<Post | null> => {
  try {
    await dbConnect();

    const blog = await Blog.findOne({ _localID: id })
      .select("content creator")
      .lean<{ content: string; creator: string } | null>();

    if (!blog) return null;

    const parsed = JSON.parse(blog.content);
    const content: BlogContentProp | undefined = parsed?.content;
    if (!content) return null;

    const creator = await User.findById(blog.creator)
      .select("fullname image")
      .lean<{ fullname: string; image: string } | null>();

    return {
      content,
      creator: creator
        ? { fullname: creator.fullname, image: creator.image }
        : null,
    };
  } catch (err) {
    console.error("[getPost]", err);
    return null;
  }
});
