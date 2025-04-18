import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Blog from "@/models/blog";
import { toast } from "sonner";

export async function POST(req: NextRequest) {
  try {
    const { _localID, content, creator } = await req.json();

    // Validate input data
    if (!_localID || !content || !creator) {
      return NextResponse.json(
        { error: "A LocalId, content, and creator are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if the email already exists
    const existingBlog = await Blog.findOneAndUpdate(
      { _localID },
      { content },
      { new: true }
    );

    if (existingBlog) {
      console.log("The blog already exist");
      return NextResponse.json(
        { message: "Blog has been updated", blog: existingBlog },
        { status: 201 }
      );
    }

    // Otherwise create new user
    console.log("Creating new blog");
    const newBlog = new Blog({ _localID, content, creator });
    await newBlog.save();

    return NextResponse.json(
      { message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    toast("Failed to upload blog");
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
