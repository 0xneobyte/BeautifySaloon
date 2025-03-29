import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      phone,
      address,
      userType,
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !gender ||
      !phone ||
      !address
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password, // Password will be hashed by the model's pre-save hook
      gender,
      phone,
      address,
      userType: userType || "customer",
    });

    // Return success response (excluding password)
    const newUser = user.toObject();
    delete newUser.password;

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
