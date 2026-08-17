import { renderNode } from "@/components/editor/components/task/preview-blog";
import CreatorBoard from "@/components/preview/creator-board";
import AdvertBoard from "@/components/preview/advert-board";
import Image from "next/image";
import Link from "next/link";
import { BlogContentProp, Node } from "@/type/blog";
import { PostCreator } from "./get-post";

/**
 * Server component — the post body is rendered into the HTML so crawlers
 * and link unfurlers see real content, not an empty shell.
 */
export default function PostView({
  content,
  creator,
  showAside = true,
}: {
  content: BlogContentProp;
  creator?: PostCreator;
  showAside?: boolean;
}) {
  return (
    <>
      <nav className="w-full z-[100] px-5 h-[70px] fixed top-0 backdrop-blur-sm bg-white/70 border-b-2 border-b-gray-200">
        <div className="flex gap-1 items-center justify-between w-full max-w-[1400px] mx-auto h-full">
          <Link href="/" className="flex gap-1 items-end">
            <Image
              src={"/images/svg/Glyph-black.svg"}
              alt="glyph logo"
              width={35}
              height={35}
            />
            <p className="text-[1.5rem] font-bold text-black">Glyph</p>
          </Link>
        </div>
      </nav>

      <div className="bg-gray-50 text-[#334155] min-h-screen pt-[100px] w-full">
        <div className="w-[100%] mx-auto max-w-[1100px] flex gap-5 px-0 md:px-5">
          <main className="flex-1 min-w-0">
            <article className="prose max-w-none border py-10 border-gray-200 bg-white">
              <div className="padding-x w-full">
                <h1 className="text-[2.2rem] md:text-[2.5rem] m-0 text-gray-800">
                  {content.title}
                </h1>
              </div>

              {content.mainImage?.url && (
                <div className="w-full aspect-[16/10] relative my-10">
                  <Image
                    src={content.mainImage.url}
                    alt={content.mainImage.alt || "Blog image"}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 850px"
                    className="object-cover object-center"
                  />
                </div>
              )}

              {content.tags && content.tags.length > 0 && (
                <div className="padding-x mb-4 flex flex-wrap gap-2">
                  {content.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="padding-x leading-loose">
                {content.body?.content?.map((node: Node, index: number) =>
                  renderNode(node, index)
                )}
              </div>
            </article>
          </main>

          {showAside && (
            <aside className="w-[290px] shrink-0 sticky top-[90px] h-fit md:flex flex-col gap-5 hidden">
              <AdvertBoard />
              {creator && (
                <CreatorBoard
                  fullname={creator.fullname}
                  image={creator.image}
                />
              )}
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
