"use client";

// import { useEditorContext } from "@/store/editor";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import { Toolbar } from "../../tool-bar";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Code from '@tiptap/extension-code'

import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);


export const TextEditor = () => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc ml-3",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal ml-3",
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
            Image.configure({
                allowBase64: true,
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
                    class: "rounded max-w-[90%] h-auto mx-auto ",
                },
            }),
        ],
        content: "<p>Hello World! 🌎️</p>",
        editorProps: {
            attributes: {
                class:
                    "w-full max-h-[80vh] min-h-[300px] overflow-y-scroll scrollbar-h pt-3 px-2 pb-3 border border-accent rounded outline-accent font-medium",
            },
        },
        onUpdate: () => console.log(editor?.getJSON()),
    });

    return (
        <div className="flex flex-col gap-3">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
