import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Salon from "@/models/Salon";
import Review from "@/models/Review";
import { authOptions } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

// GET endpoint to retrieve a specific salon by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Connect to database
    await dbConnect();

    // Ensure Review model is registered
    if (!mongoose.models.Review) {
      require("@/models/Review");
    }

    // Find salon by ID without populating reviews
    const salon = await Salon.findById(id)
      .populate("owner", "firstName lastName email -_id")
      .select("-__v");

    if (!salon) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    // Fetch reviews separately if needed
    // const reviews = await Review.find({ salon: id }).populate("customer", "firstName lastName -_id");

    return NextResponse.json({ salon }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving salon:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve salon" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a salon
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Find salon by ID
    const salon = await Salon.findById(id);
    if (!salon) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    // Check if user is the salon owner
    if (salon.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to update this salon" },
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
      logo,
      gallery,
    } = body;

    // Update salon fields
    if (name) salon.name = name;
    if (slogan !== undefined) salon.slogan = slogan;
    if (gender) salon.gender = gender;
    if (email) salon.email = email;
    if (phone) salon.phone = phone;
    if (address) salon.address = address;
    if (district) salon.district = district;
    if (city) salon.city = city;
    if (postalCode) salon.postalCode = postalCode;
    if (services) salon.services = services;
    if (logo) salon.logo = logo;
    if (gallery) salon.gallery = gallery;

    // Save updated salon
    await salon.save();

    return NextResponse.json(
      { message: "Salon updated successfully", salon },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating salon:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update salon" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a salon
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Find salon by ID
    const salon = await Salon.findById(id);
    if (!salon) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    // Check if user is the salon owner
    if (salon.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to delete this salon" },
        { status: 403 }
      );
    }

    // Delete salon
    await Salon.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Salon deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting salon:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete salon" },
      { status: 500 }
    );
  }
}
