"use client";

import { useState } from "react";
import { useBlogStore } from "@/store/blog-store";
import { Check, Copy, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodePreview() {
  const activeBlog = useBlogStore((state) => state.activeBlog);
  const [copied, setCopied] = useState(false);

  const body = activeBlog?.content.body;
  const json = body ? JSON.stringify(body, null, 2) : null;

  const handleCopy = async () => {
    if (!json) return;
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!json) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 min-h-[300px] border border-accent rounded bg-background/40 text-white/40">
        <FileJson size={22} strokeWidth={1.5} />
        <p className="text-[12px]">Write something in Structure to see its JSON here.</p>
      </div>
    );
  }

  return (
    <div className="relative border border-accent rounded overflow-hidden">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="absolute top-3 right-3 h-7 gap-1.5 text-[11px]"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <pre className="bg-gray-900 text-white/90 text-[13px] leading-relaxed p-4 pt-3 max-h-[80vh] overflow-auto scrollbar-h">
        <code>{json}</code>
      </pre>
    </div>
  );
}
