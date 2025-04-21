import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const uploadFileToS3 = async (file: Buffer, filename: string) => {
  const fileBuffer = file;
  const key = `${filename}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { filename: key, publicUrl };
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID as string,
    secretAccessKey: process.env.AWS_ACCESS_KEY as string,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { filename, publicUrl } = await uploadFileToS3(buffer, file.name);

    return NextResponse.json(
      {
        success: "uploaded file",
        data: { filename, publicUrl },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error uploaded file" }, { status: 500 });
  }
}
