"use client";

import { useBlogStore } from "@/store/blog-store";
import React, { useEffect, useState } from "react";

/** Define TypeScript types */
type Mark = {
  type: "bold" | "italic" | "link" | "strike" | "highlight" | "code";
  attrs?: { href?: string };
};

type Node = {
  type: string;
  content?: Node[];
  text?: string;
  marks?: Mark[];
  attrs?: Record<string, any>;
};

type Props = {
  content: Node[];
};

const RichTextRenderer: React.FC = () => {
  const [content, setContent] = useState<Node[]>([]);
  const activeBlog = useBlogStore((state) => state.activeBlog);

  useEffect(() => {
    if (activeBlog?.content) {
      setContent(activeBlog.content);
    }
  }, [activeBlog]);

  if (!content?.body?.content.map.length)
    return (
      <div>
        <p>Unable to view</p>
      </div>
    );

  return (
    <div className="prose">
      <div>
        <h1 className="text-6xl">{content?.title}</h1>
      </div>
      <div>
        <img
          src={content?.mainImage?.url}
          alt={content?.mainImage?.alt || ""}
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
  );
};

const renderNode = (node: Node, index: number): React.ReactNode => {
  switch (node.type) {
    case "paragraph":
      if (!node.content) return <br key={index} />;
      return <p key={index}>{renderText(node)}</p>;

    case "heading":
      const HeadingTag = `h${node.attrs?.level}` as keyof JSX.IntrinsicElements;
      return <HeadingTag key={index}>{renderText(node)}</HeadingTag>;

    case "bulletList":
      return (
        <ul key={index} className="ml-8 list-decimal">
          {node.content?.map(renderListItem)}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={index} className="ml-8 list-disc">
          {node.content?.map(renderListItem)}
        </ol>
      );

    case "listItem":
      return <li key={index}>{node.content?.map(renderText)}</li>;

    case "image":
      return (
        <img
          key={index}
          src={node.attrs?.src}
          alt={node.attrs?.alt || ""}
          style={{
            width: "100%",
            height: "50vh",
            objectFit: "cover",
            objectPosition: "center",
          }}
          className="my-10 rounded"
        />
      );

    case "blockquote":
      return <blockquote key={index}>{renderText(node)}</blockquote>;

    case "codeBlock":
      return (
        <pre key={index} className="bg-gray-900 text-white p-4 rounded">
          <code>{node.content?.map(renderText)}</code>
        </pre>
      );

    default:
      return null;
  }
};

const renderText = (node: Node): JSX.Element[] | null => {
  if (!node.content) return null;
  return node.content.map((textNode, index) => {
    if (textNode.type === "text") {
      let textElement: JSX.Element | string = textNode.text || "";
      if (textNode.marks) {
        textNode.marks.forEach((mark) => {
          switch (mark.type) {
            case "bold":
              textElement = <strong key={index}>{textElement}</strong>;
              break;
            case "italic":
              textElement = <em key={index}>{textElement}</em>;
              break;
            case "strike":
              textElement = <del key={index}>{textElement}</del>;
              break;
            case "highlight":
              textElement = <mark key={index}>{textElement}</mark>;
              break;
            case "code":
              textElement = (
                <code key={index} className="bg-gray-200 px-1 rounded">
                  {textElement}
                </code>
              );
              break;
            case "link":
              textElement = (
                <a
                  key={index}
                  href={mark.attrs?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {textElement}
                </a>
              );
              break;
          }
        });
      }
      return <React.Fragment key={index}>{textElement}</React.Fragment>;
    }
    return null;
  });
};

const renderListItem = (node: Node, index: number): React.ReactNode => {
  return <li key={index}>{node.content?.map(renderText)}</li>;
};

export default RichTextRenderer;
