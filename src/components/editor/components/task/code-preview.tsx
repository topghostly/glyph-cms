"use client";

import { useBlogStore } from "@/store/blog-store";

export default function CodePreview() {
  const activeBlog = useBlogStore((state) => state.activeBlog);

  return (
    <pre className="bg-gray-900 text-white p-4 rounded overflow-auto">
      <code>{JSON.stringify(activeBlog?.content.body, null, 2)}</code>
    </pre>
  );
}
