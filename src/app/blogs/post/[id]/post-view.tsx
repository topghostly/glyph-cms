import { renderNode } from "@/components/render/tiptap-render";
import CreatorBoard from "@/components/preview/creator-board";
import AdvertBoard from "@/components/preview/advert-board";
import Image from "next/image";
import Link from "next/link";
import { BlogContentProp, Node } from "@/type/blog";
import { PostCreator } from "./get-post";
import { estimateReadingMinutes } from "@/util/reading-time";
import { getDate } from "@/lib/utils";

/**
 * Server component — the post body is rendered into the HTML so crawlers
 * and link unfurlers see real content, not an empty shell.
 */
export default function PostView({
  content,
  creator,
  publishedAt,
  showAside = true,
}: {
  content: BlogContentProp;
  creator?: PostCreator;
  publishedAt?: string | null;
  showAside?: boolean;
}) {
  const readingMinutes = estimateReadingMinutes(content.body);
  const hasByline = Boolean(creator || publishedAt || readingMinutes);

  return (
    <>
      <nav className="w-full z-[100] px-5 h-[64px] fixed top-0 backdrop-blur-md bg-white/80 border-b border-gray-100">
        <div className="flex gap-1 items-center justify-between w-full max-w-[1100px] mx-auto h-full">
          <Link href="/" className="flex gap-2 items-center group">
            <Image
              src={"/images/svg/Glyph-black.svg"}
              alt="glyph logo"
              width={26}
              height={26}
            />
            <p className="text-[1.15rem] font-bold text-gray-900 tracking-tight">
              Glyph
            </p>
          </Link>
        </div>
      </nav>

      <div className="bg-white text-gray-600 min-h-screen pt-[64px] w-full">
        <div className="w-full mx-auto max-w-[1100px] flex gap-10 px-5 md:px-8">
          <main className="flex-1 min-w-0 pt-12 pb-24">
            <article>
              <h1 className="text-[2.25rem] md:text-[2.75rem] font-bold tracking-tight text-gray-900 leading-[1.1] mb-5 max-w-[780px]">
                {content.title}
              </h1>

              {hasByline && (
                <div className="flex flex-wrap items-center gap-2.5 text-sm text-gray-500 mb-6">
                  {creator && (
                    <div className="flex items-center gap-2">
                      <Image
                        src={creator.image || "/images/png/web-icon.png"}
                        alt={creator.fullname}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">
                        {creator.fullname}
                      </span>
                    </div>
                  )}
                  {creator && (publishedAt || readingMinutes > 0) && (
                    <span className="text-gray-300">&middot;</span>
                  )}
                  {publishedAt && (
                    <time dateTime={publishedAt}>
                      {getDate(new Date(publishedAt))}
                    </time>
                  )}
                  {publishedAt && readingMinutes > 0 && (
                    <span className="text-gray-300">&middot;</span>
                  )}
                  {readingMinutes > 0 && <span>{readingMinutes} min read</span>}
                </div>
              )}

              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {content.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {content.mainImage?.url && (
                <div className="w-full aspect-[16/9] relative mb-10 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_24px_-8px_rgba(0,0,0,0.12)]">
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

              <div
                className="prose prose-lg max-w-[680px] mx-0
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                  prose-p:text-gray-700
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-blue-600 prose-blockquote:not-italic prose-blockquote:text-gray-600 prose-blockquote:font-normal
                  prose-strong:text-gray-900
                  prose-code:text-blue-700 prose-code:before:content-none prose-code:after:content-none
                  prose-img:rounded-lg"
              >
                {content.body?.content?.map((node: Node, index: number) =>
                  renderNode(node, index)
                )}
              </div>
            </article>
          </main>

          {showAside && (
            <aside className="w-[280px] shrink-0 sticky top-[88px] h-fit md:flex flex-col gap-5 hidden pt-12">
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
