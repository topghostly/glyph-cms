"use client";

import { getAllBlogs } from "@/util/getAllBlog";
import { useEffect, useRef } from "react";
import { useUser } from "@/store/user-store";
import { useBlogStore } from "@/store/blog-store";

export default function HandleBlogSync() {
  const { userInfo } = useUser();
  const blogs = useBlogStore((state) => state.blogs);
  const addBlog = useBlogStore((state) => state.addBlog);
  const hasSynced = useRef(false); // 👈🏽 Add this

  const handleSync = async () => {
    const allLocalBlogsID = blogs.map((blog) => blog._localID);

    const onlineBlogs = await getAllBlogs(userInfo.userId);

    for (const onlineBlog of onlineBlogs) {
      const onlineContent = JSON.parse(onlineBlog.content);
      if (!allLocalBlogsID.includes(onlineContent._localID)) {
        addBlog({
          _localID: onlineContent._localID,
          content: onlineContent.content,
          creator: onlineContent.creator,
        });
      }
    }
  };

  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;
    handleSync();
  }, []);

  return null;
}
