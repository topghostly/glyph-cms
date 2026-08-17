"use client";

import { getAllBlogs } from "@/util/getAllBlog";
import { useEffect, useRef } from "react";
import { useBlogStore } from "@/store/blog-store";
import { Blog } from "@/type/blog";

export default function HandleBlogSync() {
  const blogs = useBlogStore((state) => state.blogs);
  const addBlog = useBlogStore((state) => state.addBlog);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    (async () => {
      const onlineBlogs = await getAllBlogs();
      if (!onlineBlogs) return;

      const localIDs = new Set(blogs.map((blog) => blog._localID));

      for (const onlineBlog of onlineBlogs) {
        try {
          const parsed = JSON.parse(onlineBlog.content) as Blog;
          if (!parsed?._localID || localIDs.has(parsed._localID)) continue;

          addBlog({
            _localID: parsed._localID,
            content: parsed.content,
            creator: parsed.creator,
          });
        } catch {
          // Skip any row whose stored JSON is unreadable rather than
          // failing the whole sync.
          console.warn("Skipped unparseable blog", onlineBlog?._localID);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
