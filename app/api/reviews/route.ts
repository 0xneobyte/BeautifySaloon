import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Salon from "@/models/Salon";
import { authOptions } from "@/lib/auth";

// GET endpoint to retrieve reviews
export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Build query object
    const query: any = {};

    // Filter by salon
    const salonId = searchParams.get("salon");
    if (salonId) {
      query.salon = salonId;
    }

    // Filter by customer
    const customerId = searchParams.get("customer");
    if (customerId) {
      query.customer = customerId;
    }

    // Get reviews from database
    const reviews = await Review.find(query)
      .populate("customer", "firstName lastName -_id")
      .populate("salon", "name -_id")
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving reviews:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve reviews" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new review
export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is a customer
    if (session.user.userType !== "customer") {
      return NextResponse.json(
        { error: "Only customers can submit reviews" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { salon, rating, comment } = body;

    // Validate required fields
    if (!salon || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if salon exists
    const salonExists = await Salon.findById(salon);
    if (!salonExists) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    // Check if user has already reviewed this salon
    const existingReview = await Review.findOne({
      customer: session.user.id,
      salon,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this salon" },
        { status: 400 }
      );
    }

    // Create new review
    const review = await Review.create({
      customer: session.user.id,
      salon,
      rating,
      comment,
    });

    // Add review to salon's reviews array
    await Salon.findByIdAndUpdate(salon, {
      $push: { reviews: review._id },
    });

    // Calculate new average rating for salon
    const allReviews = await Review.find({ salon });
    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / allReviews.length;

    // Update salon's rating
    await Salon.findByIdAndUpdate(salon, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    });

    // Populate customer and salon fields for response
    await review.populate("customer", "firstName lastName -_id");
    await review.populate("salon", "name -_id");

    return NextResponse.json(
      { message: "Review submitted successfully", review },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
