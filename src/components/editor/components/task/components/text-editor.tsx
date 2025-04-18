"use client";

// import { useEditorContext } from "@/store/editor";
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
import { common, createLowlight } from "lowlight";
import { Blog, Node } from "@/type/blog";
import { useEffect } from "react";
import { debounce } from "lodash";

const lowlight = createLowlight(common);

interface TextEditorProps {
  setBlog: React.Dispatch<React.SetStateAction<Blog>>;
  savedBlog: Node[];
}

export const TextEditor: React.FC<TextEditorProps> = ({
  setBlog,
  savedBlog,
}) => {
  const handleUpdate = debounce((editor: Editor) => {
    const html = editor.getJSON();

    setBlog((prevBlog) => ({
      ...prevBlog,
      content: {
        ...prevBlog.content,
        body: html as Node[],
      },
    }));
  }, 300);

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
        code: {
          HTMLAttributes: {
            class: "code bg-gray-900 text-white p-2 rounded",
          },
        },
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
        openOnClick: true,
        autolink: true,
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
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded my-10 w-[100%] h-[50vh] object-cover object-center",
        },
      }),
    ],
    content: "<p>Write your Blog body here! 🌎️</p>",
    editorProps: {
      attributes: {
        class:
          "w-full max-h-[80vh] min-h-[300px] overflow-y-scroll scrollbar-h pt-3 px-2 pb-3 border border-accent rounded outline-accent font-medium",
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
  });

  useEffect(() => {
    // console.log("Saved Blog", savedBlog);
    if (editor) {
      editor?.commands.setContent(savedBlog);
    }
  }, [editor, savedBlog]);

  return (
    <div className="flex flex-col gap-3">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
