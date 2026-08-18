"use client";

import { EditorContent, useEditor, Editor } from "@tiptap/react";
import { Toolbar } from "../../tool-bar";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import { Blog, TiptapDoc } from "@/type/blog";
import { useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { useImageCleanup } from "@/hooks/useImageCleanUp";

// Registering only what we highlight — `common` pulls in ~37 grammars.
const lowlight = createLowlight();
lowlight.register({
  javascript: js,
  typescript: ts,
  json,
  css,
  html: xml,
  bash,
  python,
});

interface TextEditorProps {
  setBlog: React.Dispatch<React.SetStateAction<Blog>>;
  savedBlog: TiptapDoc | null;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  setBlog,
  savedBlog,
}) => {
  // Memoised so the debounce timer survives re-renders — recreating it
  // every render would defeat the debounce entirely.
  const handleUpdate = useMemo(
    () =>
      debounce((editor: Editor) => {
        setBlog((prevBlog) => ({
          ...prevBlog,
          content: {
            ...prevBlog.content,
            body: editor.getJSON() as TiptapDoc,
          },
        }));
      }, 400),
    [setBlog]
  );

  useEffect(() => () => handleUpdate.cancel(), [handleUpdate]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
        // Disabled here so the explicitly configured versions below (styled
        // Code, syntax-highlighted CodeBlockLowlight) are the only ones
        // registered — otherwise Tiptap warns about duplicate extensions.
        code: false,
        codeBlock: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-chart-1",
        },
      }),
      Underline,
      Link.configure({
        // Inside an editor a click should place the caret, not navigate away.
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Code.configure({
        HTMLAttributes: {
          class: "code bg-gray-900 text-white p-2 rounded",
        },
      }),
      Image.configure({
        // Body images always go through S3, never inline base64.
        allowBase64: false,
        HTMLAttributes: {
          // Matches the published renderer's 16/10 crop so the editor
          // shows the same framing the reader will get.
          class:
            "rounded-sm my-6 w-full aspect-[16/10] object-cover object-center",
        },
      }),
      // A real placeholder: shown via CSS when the doc is empty, never
      // part of the document itself. The previous approach set the hint
      // text as actual initial content, so typing appended to it instead
      // of replacing it — "Write your Blog body here! 🌎️" ended up saved
      // as part of every new post's real body.
      Placeholder.configure({
        placeholder: "Write your blog body here...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none w-full max-h-[80vh] min-h-[300px] overflow-y-scroll scrollbar-h pt-3 px-2 pb-3 border border-accent rounded outline-accent",
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    immediatelyRender: false,
  });

  useImageCleanup(editor);

  // Load stored content when switching posts. `emitUpdate: false` stops
  // this from echoing back through onUpdate and clobbering the draft.
  useEffect(() => {
    if (!editor || !savedBlog) return;
    editor.commands.setContent(savedBlog, false);
  }, [editor, savedBlog]);

  return (
    <div className="flex flex-col gap-3">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
