import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/api-handler";

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY as string,
  },
});

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!rateLimit(session.user.id)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { key } = await req.json();

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `key` in request body" },
        { status: 400 }
      );
    }

    // Uploads namespace keys as `<userId>/<uuid>.<ext>`, so this prefix
    // check is the ownership boundary.
    if (!key.startsWith(`${session.user.id}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: key,
      })
    );

    return NextResponse.json(
      { success: true, message: `Deleted ${key}` },
      { status: 200 }
    );
  } catch (err) {
    console.error("[s3:delete]", err);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
