/**
 * Given an S3 public URL, return the object key
 * e.g. "https://my-bucket.s3.eu-north-1.amazonaws.com/foo/bar.jpg"
 *       → "foo/bar.jpg"
 */
export function extractS3Key(publicUrl: string): string {
  try {
    const url = new URL(publicUrl);
    return url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
  } catch {
    throw new Error(`Invalid S3 URL: ${publicUrl}`);
  }
}
