import mongoose from "mongoose";

const MONGODB = process.env.MONGODB;

declare global {
  // eslint-disable-next-line no-var
  var _mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cached = globalThis._mongoose ?? { conn: null, promise: null };
globalThis._mongoose = cached;

/**
 * Returns a cached mongoose connection, opening one on first call.
 * Throws if the connection fails — callers must not proceed without a DB.
 */
export default async function dbConnect() {
  if (!MONGODB) throw new Error("MONGODB env var is not set");
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
