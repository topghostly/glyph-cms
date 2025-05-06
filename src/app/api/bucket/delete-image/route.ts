import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY as string,
  },
});

/** Delete a single object by its key */
async function deleteFileFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  await s3Client.send(command);
}

export async function DELETE(req: NextRequest) {
  try {
    console.log("Starting deleting image");
    const { key } = await req.json();

    console.log("Deleting Image key", key);

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `key` in request body" },
        { status: 400 }
      );
    }

    await deleteFileFromS3(key);

    console.log("Image deleted");

    return NextResponse.json(
      { success: true, message: `Deleted ${key} from S3` },
      { status: 200 }
    );
  } catch (err) {
    console.error("S3 Delete Error:", err);
    return NextResponse.json(
      { error: "Failed to delete image from S3" },
      { status: 500 }
    );
  }
}
