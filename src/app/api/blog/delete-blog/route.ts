import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Blog from "@/models/blog";
import { toast } from "sonner";

export async function DELETE(req: NextRequest) {
  try {
    const { _localID } = await req.json();

    // Validate input data
    if (!_localID) {
      return NextResponse.json(
        { error: "_localID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if the email already exists
    const deletedBlog = await Blog.findOneAndDelete({ _localID });

    if (!deletedBlog) {
      return NextResponse.json(
        { error: "No blog found with that _localID" },
        { status: 200 }
      );
    }

    // Otherwise delete new user
    console.log("Blog deleted");
    return NextResponse.json(
      { message: "Blog deleted successfully", blog: deletedBlog },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    toast(`Failed to delete blog, ${e}`);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
