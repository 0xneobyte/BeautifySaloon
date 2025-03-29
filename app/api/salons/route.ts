import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import Salon from "@/models/Salon";
import { authOptions } from "@/lib/auth";

// GET endpoint to retrieve salons with optional filtering
export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Build query object for filtering
    const query: any = {};

    // Filter by name (case-insensitive search)
    const name = searchParams.get("name");
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Filter by district
    const district = searchParams.get("district");
    if (district) {
      query.district = district;
    }

    // Filter by city
    const city = searchParams.get("city");
    if (city) {
      query.city = city;
    }

    // Filter by postal code
    const postalCode = searchParams.get("postalCode");
    if (postalCode) {
      query.postalCode = postalCode;
    }

    // Filter by gender
    const gender = searchParams.get("gender");
    if (gender) {
      query.gender = gender;
    }

    // Filter by service category
    const category = searchParams.get("category");
    if (category) {
      query["services.category"] = category;
    }

    // Get salons from database
    const salons = await Salon.find(query)
      .populate("owner", "firstName lastName email -_id")
      .select("-__v")
      .sort({ createdAt: -1 });

    return NextResponse.json({ salons }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving salons:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve salons" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new salon
export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is a business owner
    if (session.user.userType !== "business") {
      return NextResponse.json(
        { error: "Only business accounts can register salons" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      slogan,
      gender,
      email,
      phone,
      address,
      district,
      city,
      postalCode,
      services,
    } = body;

    // Validate required fields
    if (
      !name ||
      !gender ||
      !email ||
      !phone ||
      !address ||
      !district ||
      !city ||
      !postalCode
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if salon with this name already exists
    const existingSalon = await Salon.findOne({ name, owner: session.user.id });
    if (existingSalon) {
      return NextResponse.json(
        { error: "You already have a salon with this name" },
        { status: 400 }
      );
    }

    // Create new salon
    const salon = await Salon.create({
      name,
      slogan,
      owner: session.user.id,
      gender,
      email,
      phone,
      address,
      district,
      city,
      postalCode,
      services: services || [],
    });

    return NextResponse.json(
      { message: "Salon created successfully", salon },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating salon:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create salon" },
      { status: 500 }
    );
  }
}
