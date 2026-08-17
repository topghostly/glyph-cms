"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostView from "../blogs/post/[id]/post-view";
import Loader from "@/components/external-post/loader";
import { BlogContentProp } from "@/type/blog";

/**
 * Local draft preview. Reads the active blog out of the persisted Zustand
 * store and renders it through the same component the public page uses,
 * so the preview and the published article cannot drift apart.
 */
export default function PreviewPage() {
  const [content, setContent] = useState<BlogContentProp | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("local-blogs");
      if (!raw) return void router.replace("/");

      const activeBlog = JSON.parse(raw)?.state?.activeBlog?.content;
      if (!activeBlog) return void router.replace("/");

      setContent(activeBlog);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!content) return <Loader fillColor="#cecece" strokeColor="#797979" />;

  return <PostView content={content} showAside={false} />;
}
