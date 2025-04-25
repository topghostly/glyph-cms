import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Blog from "@/models/blog";
import User from "@/models/user";
import { setCorsHeaders, handleOptionsRequest } from "@/util/cors";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Invalid UserID" }, { status: 400 });
    }

    await connectToDB();

    const validUser = await User.findById(userId);

    if (!validUser) {
      const responce = NextResponse.json(
        { mssg: "User not found" },
        { status: 404 }
      );
      return setCorsHeaders(responce);
    }

    const blogs = await Blog.find({ creator: userId });

    const responce = NextResponse.json({ blogs }, { status: 200 });
    return setCorsHeaders(responce);
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    const responce = NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
    return setCorsHeaders(responce);
  }
}

export async function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}
