"use client";

import { useEditorContext } from "@/store/editor";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import { Toolbar } from "../../tool-bar";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

export const TextEditor = () => {
    // const editor = useEditorContext();
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
                        class: "code",
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
        ],
        content: "<p>Hello World! 🌎️</p>",
        editorProps: {
            attributes: {
                class:
                    "w-full max-h-[80vh] min-h-[300px] overflow-y-scroll scrollbar-h pt-3 px-2 pb-3 border border-accent rounded outline-accent font-medium",
            },
        },
        onUpdate: () => console.log(editor?.getHTML()),
    });

    return (
        <>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </>
    );
};
