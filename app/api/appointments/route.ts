import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import Appointment from "@/models/Appointment";
import Salon from "@/models/Salon";
import { authOptions } from "@/lib/auth";

// GET endpoint to retrieve appointments for the authenticated user
export async function GET(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Build query object
    let query: any = {};

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      query.status = status;
    }

    // Filter by date
    const date = searchParams.get("date");
    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      query.date = {
        $gte: dateObj,
        $lt: nextDay,
      };
    }

    // Different queries for business owners and customers
    if (session.user.userType === "business") {
      // Find salons owned by this business user
      const salons = await Salon.find({ owner: session.user.id }).select("_id");
      const salonIds = salons.map((salon) => salon._id);

      // Find appointments for these salons
      query.salon = { $in: salonIds };
    } else {
      // For customers, find their own appointments
      query.customer = session.user.id;
    }

    // Get appointments from database
    const appointments = await Appointment.find(query)
      .populate("customer", "firstName lastName email -_id")
      .populate("salon", "name address -_id")
      .sort({ date: 1, startTime: 1 });

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving appointments:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve appointments" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new appointment
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
        { error: "Only customers can book appointments" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { salon, service, date, startTime, endTime, notes } = body;

    // Validate required fields
    if (!salon || !service || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Create new appointment
    const appointment = await Appointment.create({
      customer: session.user.id,
      salon,
      service,
      date: new Date(date),
      startTime,
      endTime,
      status: "pending",
      notes,
    });

    // Populate customer and salon fields for response
    await appointment.populate("customer", "firstName lastName email -_id");
    await appointment.populate("salon", "name address -_id");

    return NextResponse.json(
      { message: "Appointment created successfully", appointment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create appointment" },
      { status: 500 }
    );
  }
}
