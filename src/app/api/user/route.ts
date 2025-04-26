import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const { email, fullname, image } = await req.json();

    // Validate input data
    if (!email || !fullname || !image) {
      return NextResponse.json(
        { error: "Name, email, and image are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered", user: existingUser },
        { status: 201 }
      );
    }

    // Otherwise create new user
    const newUser = new User({ email, fullname, image });
    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
