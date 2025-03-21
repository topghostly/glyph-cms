"use client";

import { useEditorContext } from "@/store/editor";
import { Editor } from "@tiptap/react";

import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Eraser,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Minus,
    Redo,
    Strikethrough,
    Undo,
    Upload,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { ChangeEvent } from "react";

export const Toolbar = ({ editor }: { editor: Editor | null }) => {

    if (!editor) {
        return null;
    }

    const OPTIONS = [
        {
            icon: <Heading1 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            preesed: editor.isActive("heading", { level: 1 }),
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            preesed: editor.isActive("heading", { level: 2 }),
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            preesed: editor.isActive("heading", { level: 3 }),
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            preesed: editor.isActive("bold"),
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            preesed: editor.isActive("italic"),
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            preesed: editor.isActive("strike"),
        },
        {
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            preesed: editor.isActive({ textAlign: "left" }),
        },
        {
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            preesed: editor.isActive({ textAlign: "center" }),
        },
        {
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            preesed: editor.isActive({ textAlign: "right" }),
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            preesed: editor.isActive("bulletList"),
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            preesed: editor.isActive("orderedList"),
        },
        {
            icon: <Highlighter className="size-4" />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            preesed: editor.isActive("highlight"),
        },
        {
            icon: <Code className="size-4" />,
            onClick: () => editor.commands.toggleCode(),
            preesed: editor.isActive("code"),
        },
        {
            icon: <Minus className="size-4" />,
            onClick: () => editor.chain().focus().setHorizontalRule().run(),
            preesed: false,
        },
        {
            icon: <Eraser className="size-4" />,
            onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
            preesed: false,
        },
        {
            icon: <Undo className="size-4" />,
            onClick: () => editor.chain().focus().undo().run(),
            preesed: false,
        },
        {
            icon: <Redo className="size-4" />,
            onClick: () => editor.chain().focus().redo().run(),
            preesed: false,
        },
        {
            icon: <Upload className="size-4" />,
            onClick: () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = async (event: any) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    const objectURL = URL.createObjectURL(file);

                    editor.chain().focus().setImage({ src: objectURL }).run();
                };
                input.click();
            },
            preesed: false,
        },

    ];
    return (
        <div className="flex gap-5 sticky top-0 bg-background z-500">
            <div>
                {OPTIONS.map((option, index) => (
                    <Toggle
                        size={"lg"}
                        key={index}
                        pressed={option.preesed}
                        onPressedChange={option.onClick}
                    >
                        {option.icon}
                    </Toggle>
                ))}
            </div>
        </div>
    );
};