"use client";

import { renderNode } from "@/components/editor/components/task/preview-blog";
import { getDate } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [content, setcontent] = useState();

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem("local-blogs")!);

    setcontent(blogs.state.activeBlog.content);
  }, []);
  return (
    <main className="bg-gray-100 text-black min-h-screen select-none">
      <div className="max-w-[870px] mx-auto">
        <div className="flex gap-1 justify-end items-center h-18 px-2">
          <Image
            src={"/images/svg/Glyph-01.svg"}
            alt="glyph logo"
            width={35}
            height={35}
          />
          <p className="text-2xl font-bold text-gray-500">
            Glyph <span className="font-medium text-sm">(beta)</span>
          </p>
        </div>
        <div className="prose border p-10 rounded-4xl border-gray-200 bg-white">
          <div className="flex gap-5 items-center">
            <p className="text-gray-700 px-3 py-1 bg-gray-200 rounded-full">
              {getDate()}
            </p>
            <p className="text-gray-700 px-3 py-1 bg-gray-200 rounded-full">
              Damilare A.
            </p>
            <p className="text-gray-700 px-3 py-1 bg-gray-200 rounded-full">
              3 mins read
            </p>
          </div>

          <div>
            <h1 className="text-5xl text-gray-800">{content?.title}</h1>
          </div>
          <div>
            <Image
              src={content?.mainImage?.url}
              alt={content?.mainImage?.alt || "Blog Image"}
              style={{
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              className="my-4 rounded-2xl"
              width={0}
              height={0}
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
