import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import Salon, { ISalon } from "@/models/Salon";
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
      query.district = { $regex: district, $options: "i" };
    }

    // Filter by city
    const city = searchParams.get("city");
    if (city) {
      // Check both city and address fields for the search term
      query.$or = [
        { city: { $regex: city, $options: "i" } },
        { address: { $regex: city, $options: "i" } },
      ];
    }

    // Filter by postal code
    const postalCode = searchParams.get("postalCode");
    if (postalCode) {
      query.postalCode = { $regex: postalCode, $options: "i" };
    }

    // Filter by gender
    const gender = searchParams.get("gender");
    if (gender) {
      query.gender = gender;
    }

    // Filter by service category
    const category = searchParams.get("category");
    if (category) {
      // Map frontend category names to service types in the database
      let serviceCategory;
      switch (category.toLowerCase()) {
        case "hair":
          serviceCategory = "Hair Styling";
          break;
        case "nails":
          serviceCategory = "Nails";
          break;
        case "face-body":
        case "face-and-body":
          serviceCategory = "Face and Body";
          break;
        default:
          serviceCategory = category;
      }

      if (serviceCategory) {
        // Find salons that have at least one service of the requested category
        query["services.category"] = { $regex: serviceCategory, $options: "i" };
      }
    }

    console.log("Search params:", {
      name: name || null,
      city: city || null,
      postalCode: postalCode || null,
      category: category || null,
    });
    console.log("MongoDB query:", JSON.stringify(query, null, 2));

    // Get salons from database
    const salons = await Salon.find(query)
      .populate("owner", "firstName lastName email -_id")
      .select("-__v")
      .sort({ createdAt: -1 });

    console.log("Found salons:", salons.length);

    if (salons.length === 0) {
      // Try a more relaxed search if no results are found
      const relaxedQuery: any = {};
      if (city) {
        relaxedQuery.$or = [
          { city: { $regex: city, $options: "i" } },
          { address: { $regex: city, $options: "i" } },
          { district: { $regex: city, $options: "i" } },
        ];
      }

      if (relaxedQuery.$or) {
        console.log(
          "Trying relaxed query:",
          JSON.stringify(relaxedQuery, null, 2)
        );
        const relaxedSalons = await Salon.find(relaxedQuery)
          .populate("owner", "firstName lastName email -_id")
          .select("-__v")
          .sort({ createdAt: -1 });

        console.log("Relaxed search found salons:", relaxedSalons.length);

        if (relaxedSalons.length > 0) {
          return NextResponse.json({ salons: relaxedSalons }, { status: 200 });
        }
      }
    }

    // If we have salons but want to prioritize those with all service types (hair, nails, face and body)
    if (salons.length > 0) {
      // Calculate a "completeness" score for each salon based on service categories
      const scoredSalons = salons.map((salon) => {
        const salonObj = salon.toObject();
        let score = 0;

        // Check if salon has Hair Styling services
        if (salonObj.services.some((s) => s.category === "Hair Styling")) {
          score += 1;
        }

        // Check if salon has Nails services
        if (salonObj.services.some((s) => s.category === "Nails")) {
          score += 1;
        }

        // Check if salon has Face and Body services
        if (salonObj.services.some((s) => s.category === "Face and Body")) {
          score += 1;
        }

        return { ...salonObj, completenessScore: score };
      });

      // Sort by completeness score (descending) and then by creation date
      scoredSalons.sort((a, b) => {
        if (b.completenessScore !== a.completenessScore) {
          return b.completenessScore - a.completenessScore;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      // Remove the score property before sending the response
      const sortedSalons = scoredSalons.map(
        ({ completenessScore, ...salon }) => salon
      );

      console.log("Sorted salons by service completeness");
      return NextResponse.json({ salons: sortedSalons }, { status: 200 });
    }

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
