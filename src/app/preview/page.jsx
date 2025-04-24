"use client";

import { renderNode } from "@/components/editor/components/task/preview-blog";
import AdvertBoard from "@/components/preview/advert-board";
import CreatorBoard from "@/components/preview/creator-board";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [content, setcontent] = useState();

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem("local-blogs"));
    setcontent(blogs.state.activeBlog.content);
  }, []);
  return (
    <>
      {/*  NAVBAR */}
      <nav className="w-full z-[100] px-5 h-[70px] fixed top-0 backdrop-blur-sm bg-white/70 border-b-2 border-b-gray-200">
        <div className="flex gap-1 items-center w-full max-w-[1400px] mx-auto h-full">
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
      </nav>
      {/*  NAVBAR */}
      <div className="bg-gray-50 text-[#334155] min-h-screen select-none pt-[100px] w-full">
        <div className="w-[100%] mx-auto max-w-[1100px] flex gap-5 px-5">
          <main className="w-[100%]">
            <div className="max-w-[870px] w-full">
              <div className="prose border py-10 border-gray-200 bg-white">
                <div className="padding-x w-full">
                  <h1 className="text-[2.2rem] md:text-[2.5rem] m-0 text-gray-800">
                    {content?.title}
                  </h1>
                </div>
                <div className="w-full aspect-[16/9] relative my-10">
                  {content?.mainImage?.url && (
                    <Image
                      src={content.mainImage.url}
                      alt={content?.mainImage?.alt || "Blog Image"}
                      style={{
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      fill
                    />
                  )}
                </div>

                {(content?.tags ?? []).length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(content?.tags ?? []).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="padding-x leading-loose">
                  {content?.body?.content.map((node, index) =>
                    renderNode(node, index)
                  )}
                </div>
              </div>
            </div>
          </main>
          <aside className="w-[290px] sticky top-[90px] h-fit md:flex flex-col gap-5 hidden">
            <AdvertBoard />
            <CreatorBoard />
          </aside>
        </div>
      </div>
    </>
  );
}
