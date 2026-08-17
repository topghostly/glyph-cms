import { z } from "zod";

/**
 * `creator` is deliberately absent — it is always taken from the session,
 * never from the request body.
 */
export const blogUploadSchema = z.object({
  _localID: z.string().uuid(),
  content: z.string().max(1_000_000),
  link: z.string().url(),
});

export const localIdSchema = z.object({
  _localID: z.string().uuid(),
});

export const s3KeySchema = z.object({
  key: z.string().min(1).max(512),
});

export const listBlogsSchema = z.object({
  limit: z.number().int().min(1).max(50).default(50),
});
