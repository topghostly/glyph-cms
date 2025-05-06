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
import { common, createLowlight } from "lowlight";
import { Blog, Node } from "@/type/blog";
import { useEffect } from "react";
import { debounce } from "lodash";
import HardBreak from "@tiptap/extension-hard-break";
import { useImageCleanup } from "@/hooks/useImageCleanUp";

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
      HardBreak,
    ],
    content: "<p>Write your Blog body here! 🌎️</p>",
    editorProps: {
      attributes: {
        class:
          "w-full max-h-[80vh] min-h-[300px] overflow-y-scroll scrollbar-h pt-3 px-2 pb-3 border border-accent rounded outline-accent font-medium",
      },
    },
    // editorProps: {
    //   handlePaste(view, event) {
    //     const text = event.clipboardData?.getData("text/plain");
    //     if (!text) return false;

    //     // Split the text by double newlines to create paragraphs
    //     const paragraphs = text.split(/\n{2,}/);
    //     const { schema } = view.state;
    //     const nodes: any[] = [];

    //     for (const para of paragraphs) {
    //       // Split paragraph by single newlines to insert hard breaks
    //       const lines = para.split("\n");
    //       const paragraphContent = lines.flatMap((line, index) => {
    //         const lineNodes = [schema.text(line)];
    //         if (index !== lines.length - 1) {
    //           lineNodes.push(schema.nodes.hardBreak.create());
    //         }
    //         return lineNodes;
    //       });

    //       const paragraphNode = schema.nodes.paragraph.create(
    //         {},
    //         paragraphContent
    //       );
    //       nodes.push(paragraphNode);
    //     }

    //     const fragment =
    //       schema.nodes.doc.contentMatch.defaultType?.createAndFill?.({}, nodes);
    //     if (!fragment) return false;

    //     view.dispatch(view.state.tr.replaceSelectionWith(fragment));
    //     event.preventDefault();
    //     return true;
    //   },
    // },
    onUpdate: ({ editor }) => handleUpdate(editor),
    immediatelyRender: false,
  });

  useImageCleanup(editor);

  useEffect(() => {
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
