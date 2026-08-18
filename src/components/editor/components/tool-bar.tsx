"use client";

import { Editor } from "@tiptap/react";

import {
  Bold,
  Code,
  CodeIcon,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Text,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useState } from "react";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;
const MAX_FILE_SIZE_MB = 5;

type ToolbarOption = {
  icon: React.ReactNode;
  onClick: () => void;
  pressed: boolean;
  tip: string;
};

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const insertImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ALLOWED_TYPES.join(",");

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
        toast(`🚫 Unsupported file type: ${file.type}`);
        return;
      }
      if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
        toast(`🚫 Image too large. Max ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/bucket/image-upload", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: null }));
          toast(`❌ ${error ?? "Image upload failed."}`);
          return;
        }

        const { data } = await res.json();
        if (!data?.publicUrl) {
          toast("❌ Upload returned no URL.");
          return;
        }

        editor
          .chain()
          .focus()
          .setImage({ src: data.publicUrl, alt: file.name })
          .run();
      } catch (err) {
        console.error("Body image upload failed:", err);
        toast("❌ Image upload failed.");
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");

    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      new URL(url);
    } catch {
      toast("🚫 That doesn't look like a valid URL.");
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const OPTIONS: ToolbarOption[] = [
    {
      icon: <Text className="w-4 h-4" />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      pressed: editor.isActive("paragraph"),
      tip: "Paragraph (normal text)",
    },
    {
      // h1 is reserved for the post title, so the editor starts at h2.
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
      tip: "Heading 1",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
      tip: "Heading 2",
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      pressed: editor.isActive("heading", { level: 4 }),
      tip: "Heading 3",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
      tip: "Bold",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
      tip: "Italic",
    },
    {
      icon: <UnderlineIcon className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive("underline"),
      tip: "Underline",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
      tip: "Strike-through",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
      tip: "Highlight",
    },
    {
      icon: <LinkIcon className="size-4" />,
      onClick: setLink,
      pressed: editor.isActive("link"),
      tip: "Add or edit link",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
      tip: "Bullet list",
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
      tip: "Numbered list",
    },
    {
      icon: <Quote className="size-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      pressed: editor.isActive("blockquote"),
      tip: "Blockquote",
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      pressed: editor.isActive("code"),
      tip: "Inline code",
    },
    {
      icon: <CodeIcon className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("codeBlock"),
      tip: "Code block",
    },
    {
      icon: <Minus className="size-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      pressed: false,
      tip: "Horizontal rule",
    },
    {
      icon: <Eraser className="size-4" />,
      onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
      pressed: false,
      tip: "Clear formatting",
    },
    {
      icon: <Undo className="size-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      pressed: false,
      tip: "Undo",
    },
    {
      icon: <Redo className="size-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      pressed: false,
      tip: "Redo",
    },
    {
      icon: uploading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <ImageIcon className="w-4 h-4" />
      ),
      onClick: () => {
        if (!uploading) insertImage();
      },
      pressed: false,
      tip: uploading ? "Uploading…" : "Insert image",
    },
  ];

  return (
    <div className="flex gap-5 sticky top-0 bg-background z-5">
      <div className="flex gap-1 flex-wrap">
        {OPTIONS.map((option) => (
          <TooltipProvider key={option.tip}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="lg"
                  aria-label={option.tip}
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
