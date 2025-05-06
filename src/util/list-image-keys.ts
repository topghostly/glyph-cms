import { Node } from "@/type/blog";
import { extractS3Key } from "./get-s3-key";

export function listImageKeys(doc: Node): string[] {
  const keys: string[] = [];
  const recurse = (node: Node) => {
    if (node.type === "image" && node.attrs?.src) {
      keys.push(extractS3Key(node.attrs.src));
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(recurse);
    }
  };
  recurse(doc);
  return keys;
}
