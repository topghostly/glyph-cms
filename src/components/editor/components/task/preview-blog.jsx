"use client";

import { useBlogStore } from "@/store/blog-store";
import { WholeWord } from "lucide-react";
import Image from "next/image";
import React from "react";

const alignClass = (node) => {
  switch (node.attrs?.textAlign) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "justify":
      return "text-justify";
    default:
      return "";
  }
};

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

      {content.tags?.length > 0 && (
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

export const renderNode = (node, index) => {
  switch (node.type) {
    case "paragraph":
      if (!node.content) return <br key={index} />;
      return (
        <p key={index} className={alignClass(node)}>
          {renderText(node)}
        </p>
      );

    case "heading": {
      const level = node.attrs?.level ?? 2;
      const HeadingTag = `h${level}`;
      return (
        <HeadingTag key={index} className={alignClass(node)}>
          {renderText(node)}
        </HeadingTag>
      );
    }

    case "bulletList":
      return (
        <ul key={index} className="ml-8 list-disc">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={index}
          className="ml-8 list-decimal"
          start={node.attrs?.start ?? 1}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      );

    // List items hold block nodes (usually paragraphs), so recurse rather
    // than assuming their children are inline text.
    case "listItem":
      return (
        <li key={index}>{node.content?.map((child, i) => renderNode(child, i))}</li>
      );

    case "image":
      return (
        <div key={index} className="w-full aspect-[16/10] relative my-6">
          <Image
            src={node.attrs?.src}
            alt={node.attrs?.alt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 750px"
            className="rounded-sm object-cover object-center"
          />
        </div>
      );

    case "blockquote":
      return (
        <blockquote key={index} className="border-l-4 pl-4 italic">
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case "codeBlock": {
      const code = node.content?.map((n) => n.text).join("\n") ?? "";
      return (
        <pre
          key={index}
          className="bg-gray-900 text-white p-4 rounded-sm overflow-x-auto my-4"
        >
          <code>{code}</code>
        </pre>
      );
    }

    case "horizontalRule":
      return <hr key={index} className="my-8 border-gray-300" />;

    case "hardBreak":
      return <br key={index} />;

    default:
      return null;
  }
};

export const renderText = (node) => {
  if (!node.content) return null;

  return node.content.map((textNode, index) => {
    if (textNode.type === "hardBreak") return <br key={index} />;
    if (textNode.type !== "text") return null;

    let element = textNode.text || "";

    // Marks nest, so each wrap needs its own key to stay stable.
    (textNode.marks ?? []).forEach((mark, markIndex) => {
      const key = `${index}-${markIndex}`;
      switch (mark.type) {
        case "bold":
          element = <strong key={key}>{element}</strong>;
          break;
        case "italic":
          element = <em key={key}>{element}</em>;
          break;
        case "underline":
          element = <u key={key}>{element}</u>;
          break;
        case "strike":
          element = <del key={key}>{element}</del>;
          break;
        case "highlight":
          element = <mark key={key}>{element}</mark>;
          break;
        case "code":
          element = (
            <code key={key} className="bg-gray-200 text-gray-900 px-1 rounded">
              {element}
            </code>
          );
          break;
        case "link":
          element = (
            <a
              key={key}
              href={mark.attrs?.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-blue-500 underline"
            >
              {element}
            </a>
          );
          break;
        default:
          break;
      }
    });

    return <React.Fragment key={index}>{element}</React.Fragment>;
  });
};

export default RichTextRenderer;
