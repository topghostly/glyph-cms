"use client";

import { useBlogStore } from "@/store/blog-store";
import { WholeWord } from "lucide-react";
import Image from "next/image";
import { renderNode } from "@/components/render/tiptap-render";

/**
 * Editor-side preview pane. Uses the same pure renderer as the public
 * post page so the preview cannot drift from the published output.
 */
const RichTextRenderer = () => {
  const activeBlog = useBlogStore((state) => state.activeBlog);
  const content = activeBlog?.content;

  if (!content?.body?.content?.length) {
    return (
      <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
        <p className="text-accent flex gap-3">
          <WholeWord />
          Add content to body
        </p>
      </div>
    );
  }

  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-4xl">{content.title}</h1>

      {content.mainImage?.url && (
        <div className="w-full aspect-[16/10] relative my-6">
          <Image
            src={content.mainImage.url}
            alt={content.mainImage.alt || "Blog image"}
            fill
            sizes="(max-width: 768px) 100vw, 750px"
            className="rounded object-cover object-center"
          />
        </div>
      )}

      {content.tags && content.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
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

      {content.body.content.map((node, index) => renderNode(node, index))}
    </div>
  );
};

export default RichTextRenderer;
