// hooks/useImageCleanup.ts
import { useEffect, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { listImageKeys } from "@/util/list-image-keys";
import { Node } from "@/type/blog";

export function useImageCleanup(editor: Editor | null) {
  // keep the “last known” list of keys
  const prevKeys = useRef<string[]>([]);

  useEffect(() => {
    if (!editor) return;

    const onUpdate = () => {
      const json = editor.getJSON();
      const currentKeys = listImageKeys(json as unknown as Node);

      // find keys that were in prevKeys but no longer in currentKeys
      const removed = prevKeys.current.filter((k) => !currentKeys.includes(k));

      removed.forEach(async (key) => {
        console.log("Starting Image delete");
        try {
          await fetch("/api/bucket/delete-image", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          });

          console.log("Deleted Image ");
        } catch (err) {
          console.error("Failed to delete orphan image", key, err);
        }
      });

      // update our ref
      prevKeys.current = currentKeys;
    };

    // initialize first run
    prevKeys.current = listImageKeys(editor.getJSON() as unknown as Node);
    // subscribe
    editor.on("update", onUpdate);
    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor]);
}
