import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Blog from "@/models/blog";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const blogs = await Blog.find({ creator: userId });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
