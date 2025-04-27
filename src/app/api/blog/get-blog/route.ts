import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Blog from "@/models/blog";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const { _localID } = await req.json();

    if (!_localID) {
      return NextResponse.json(
        { error: "Local ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const blog = await Blog.findOne({ _localID });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const creator = await User.findById(blog.creator);

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        blog,
        creator: {
          _id: creator._id,
          email: creator.email,
          fullname: creator.fullname,
          image: creator.image,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog and creator:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog and creator" },
      { status: 500 }
    );
  }
}
