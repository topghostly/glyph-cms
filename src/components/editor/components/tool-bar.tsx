"use client";

// import { useEditorContext } from "@/store/editor";
import { Editor } from "@tiptap/react";

import {
  //   AlignCenter,
  //   AlignLeft,
  //   AlignRight,
  Bold,
  Code,
  CodeIcon,
  Eraser,
  Heading1,
  Heading2,
  // Heading3,
  Highlighter,
  Image,
  Italic,
  List,
  ListOrdered,
  Minus,
  Redo,
  Strikethrough,
  Text,
  Undo,
  Upload,
  // Upload,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRandomNumber } from "@/util/generate-number";
import { useState } from "react";

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const [pendingKeys, setPendingKeys] = useState<string[]>([]);

  const addPendingImage = (key: string) => {
    setPendingKeys((all) => [...all, key]);
  };

  const OPTIONS = [
    // {
    //   icon: <Heading1 className="size-4" />,
    //   onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    //   preesed: editor.isActive("heading", { level: 1 }),
    // },
    {
      icon: <Text className="w-4 h-4" />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      pressed: editor.isActive("paragraph"),
      tip: "Paragraph (normal text)",
    },
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
      tip: "Heading level 1",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
      tip: "Heading level 2",
    },

    {
      icon: <Eraser className="size-4" />,
      onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
      preesed: false,
      tip: "Clear formatting",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
      tip: "Bold",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
      tip: "Italic",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
      tip: "Strike-through",
    },
    // {
    //     icon: <AlignLeft className="size-4" />,
    //     onClick: () => editor.chain().focus().setTextAlign("left").run(),
    //     preesed: editor.isActive({ textAlign: "left" }),
    // },
    // {
    //     icon: <AlignCenter className="size-4" />,
    //     onClick: () => editor.chain().focus().setTextAlign("center").run(),
    //     preesed: editor.isActive({ textAlign: "center" }),
    // },
    // {
    //     icon: <AlignRight className="size-4" />,
    //     onClick: () => editor.chain().focus().setTextAlign("right").run(),
    //     preesed: editor.isActive({ textAlign: "right" }),
    // },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
      tip: "Bullet list",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
      tip: "Numbered list",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive("highlight"),
      tip: "Highlight",
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.commands.toggleCode(),
      preesed: editor.isActive("code"),
      tip: "Inline code (mark)",
    },
    // {
    //   icon: <CodeIcon className="w-4 h-4" />,
    //   onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    //   pressed: editor.isActive("codeBlock"),
    // },
    {
      icon: <Minus className="size-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      preesed: false,
      tip: "Horizontal rule",
    },
    {
      icon: <Undo className="size-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      preesed: false,
      tip: "Undo",
    },
    {
      icon: <Redo className="size-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      preesed: false,
      tip: "Redo",
    },
    {
      icon: <Image className="w-4 h-4" />,
      tip: "Upload image",
      onClick: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;

          const initialRandomNumber = getRandomNumber();

          const form = new FormData();
          form.append("file", file, `${initialRandomNumber}-${file.name}`);

          const res = await fetch("/api/bucket/image-upload", {
            method: "POST",
            body: form,
          });
          const { data } = await res.json();
          const { filename, publicUrl } = data;
          console.log("The filename and public URI from the body image", data);

          editor
            .chain()
            .focus()
            .setImage({
              src: publicUrl,
              alt: filename,
            })
            .run();

          addPendingImage(filename);
        };
        input.click();
      },
    },
  ];
  return (
    <div className="flex gap-5 sticky top-0 bg-background z-5">
      <div className="flex gap-1 flex-wrap">
        {OPTIONS.map((option, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="lg"
                  pressed={option.pressed}
                  onPressedChange={option.onClick}
                >
                  {option.icon}
                </Toggle>
              </TooltipTrigger>

              <TooltipContent>
                <p>{option.tip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
