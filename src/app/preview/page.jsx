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
      <nav className="w-full px-5 h-[70px] fixed top-0 backdrop-blur-sm bg-white/70 border-b-2 border-b-gray-200">
        <div className="flex gap-1 items-center w-full max-w-[1400px] mx-auto h-full ">
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
      <div className="bg-gray-50 text-[#334155] min-h-screen select-none pt-[100px] w-full ">
        <div className="w-fit mx-auto flex gap-5">
          <main className="">
            <div className="max-w-[870px]">
              <div className="prose border py-10 border-gray-200 bg-white">
                {/* <div className="flex gap-5 items-center">
              <p className="text-gray-700 px-3 py-1 bg-gray-200 rounded-full">
                {getDate()}
              </p>
              <p className="text-gray-700 px-3 py-1 bg-gray-200 rounded-full">
                Damilare A.
              </p>
              <p className="text-gray-700 px-3 py-1 bg-gray-200 rounded-full">
                3 mins read
              </p>
            </div> */}
                <div className="padding-x">
                  <h1 className="text-[2.2rem] md:text-[2.5rem] m-0 text-gray-800">
                    {content?.title}
                  </h1>
                </div>
                {content?.mainImage?.url && (
                  <Image
                    src={content.mainImage.url}
                    alt={content?.mainImage?.alt || "Blog Image"}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    className="my-10"
                    width={0}
                    height={0}
                  />
                )}

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
          <aside className="w-[250px] sticky top-[90px] h-fit md:flex flex-col gap-5 hidden">
            <AdvertBoard />
            <CreatorBoard />
          </aside>
        </div>
      </div>
    </>
  );
}
