import { Node } from "@/type/blog";

const BUCKET_HOST = `${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`;

/**
 * Collects S3 object keys for images in a Tiptap document.
 * Data URIs, relative paths and third-party URLs are ignored — only
 * objects we actually own in the bucket are eligible for cleanup.
 */
export function listImageKeys(doc: Node): string[] {
  const keys: string[] = [];

  const recurse = (node: Node) => {
    const src = node.attrs?.src;

    if (node.type === "image" && src) {
      try {
        const url = new URL(src);
        if (url.hostname === BUCKET_HOST) {
          keys.push(url.pathname.replace(/^\//, ""));
        }
      } catch {
        // data: URI or relative path — not a bucket object.
      }
    }

    if (Array.isArray(node.content)) node.content.forEach(recurse);
  };

  recurse(doc);
  return keys;
}
