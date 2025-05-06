import { extractS3Key } from "./get-s3-key";

export function listImageKeys(doc: any): string[] {
  const keys: string[] = [];
  const recurse = (node: any) => {
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
