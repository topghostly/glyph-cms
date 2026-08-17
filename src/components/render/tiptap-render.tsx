import React from "react";
import Image from "next/image";
import { Node } from "@/type/blog";

/**
 * Pure Tiptap-JSON -> JSX renderer.
 *
 * Deliberately has NO "use client" directive: it holds no state and no
 * hooks, so both the server-rendered public post page and the client-side
 * editor preview import it. Adding a directive here would make the public
 * page fall back to client rendering and lose its SEO value.
 */

const alignClass = (node: Node): string => {
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

export const renderNode = (node: Node, index: number): React.ReactNode => {
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
      const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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

    // List items contain block nodes (usually paragraphs), so recurse
    // rather than assuming their children are inline text.
    case "listItem":
      return (
        <li key={index}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </li>
      );

    case "image":
      if (!node.attrs?.src) return null;
      return (
        <div key={index} className="w-full aspect-[16/10] relative my-6">
          <Image
            src={node.attrs.src}
            alt={node.attrs.alt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 850px"
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

export const renderText = (node: Node): React.ReactNode => {
  if (!node.content) return null;

  return node.content.map((textNode, index) => {
    if (textNode.type === "hardBreak") return <br key={index} />;
    if (textNode.type !== "text") return null;

    let element: React.ReactNode = textNode.text || "";

    // Marks nest, so each wrapper needs its own stable key.
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
