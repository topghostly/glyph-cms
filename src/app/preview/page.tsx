"use client";

import { renderNode } from "@/components/editor/components/task/preview-blog";
import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [content, setcontent] = useState();

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem("local-blogs")!);

    setcontent(blogs.state.activeBlog.content);
  }, []);
  return (
    <main className="bg-white text-black min-h-screen">
      <div className="max-w-[850px] mx-auto pt-10 ">
        <div className="prose">
          <div>
            <h1 className="text-6xl">{content?.title}</h1>
          </div>
          <div>
            <img
              src={content?.mainImage?.url}
              alt={content?.mainImage?.alt || "Blog Image"}
              style={{
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              className="my-4 rounded"
            />
          </div>

          {content?.tags?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {content?.body?.content.map((node, index) => renderNode(node, index))}
        </div>
      </div>
    </main>
  );
}
