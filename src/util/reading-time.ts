import { Node, TiptapDoc } from "@/type/blog";

const AVERAGE_WORDS_PER_MINUTE = 200;

function collectText(node: Node): string {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(collectText).join(" ");
}

/** Rough estimate, same heuristic Medium/most CMSs use: words / 200wpm. */
export function estimateReadingMinutes(body?: TiptapDoc | null): number {
  if (!body?.content?.length) return 0;
  const text = body.content.map(collectText).join(" ").trim();
  if (!text) return 0;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / AVERAGE_WORDS_PER_MINUTE));
}
