import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import Appointment from "@/models/Appointment";
import Salon from "@/models/Salon";
import { authOptions } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

// GET endpoint to retrieve a specific appointment by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Find appointment by ID
    const appointment = await Appointment.findById(id)
      .populate("customer", "firstName lastName email -_id")
      .populate("salon", "name address -_id");

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to view this appointment
    const userIsCustomer =
      appointment.customer._id.toString() === session.user.id;
    let userIsSalonOwner = false;

    if (session.user.userType === "business") {
      const salon = await Salon.findById(appointment.salon);
      userIsSalonOwner = salon && salon.owner.toString() === session.user.id;
    }

    if (!userIsCustomer && !userIsSalonOwner) {
      return NextResponse.json(
        { error: "You do not have permission to view this appointment" },
        { status: 403 }
      );
    }

    return NextResponse.json({ appointment }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving appointment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve appointment" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update an appointment status
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

    // Find appointment by ID
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check permissions based on the status change
    const body = await req.json();
    const { status, notes } = body;

    let userHasPermission = false;

    // Customer can only cancel their own appointment
    if (session.user.userType === "customer") {
      if (
        appointment.customer.toString() === session.user.id &&
        status === "cancelled"
      ) {
        userHasPermission = true;
      }
    }
    // Business owner can confirm or complete appointments for their salons
    else if (session.user.userType === "business") {
      const salon = await Salon.findById(appointment.salon);
      if (salon && salon.owner.toString() === session.user.id) {
        if (status === "confirmed" || status === "completed") {
          userHasPermission = true;
        }
      }
    }

    if (!userHasPermission) {
      return NextResponse.json(
        { error: "You do not have permission to update this appointment" },
        { status: 403 }
      );
    }

    // Update appointment
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;

    // Save updated appointment
    await appointment.save();

    // Populate customer and salon fields for response
    await appointment.populate("customer", "firstName lastName email -_id");
    await appointment.populate("salon", "name address -_id");

    return NextResponse.json(
      { message: "Appointment updated successfully", appointment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update appointment" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete an appointment
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

    // Find appointment by ID
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to delete this appointment
    let userHasPermission = false;

    // Customer can only delete their own appointment
    if (session.user.userType === "customer") {
      if (appointment.customer.toString() === session.user.id) {
        userHasPermission = true;
      }
    }
    // Business owner can delete appointments for their salons
    else if (session.user.userType === "business") {
      const salon = await Salon.findById(appointment.salon);
      if (salon && salon.owner.toString() === session.user.id) {
        userHasPermission = true;
      }
    }

    if (!userHasPermission) {
      return NextResponse.json(
        { error: "You do not have permission to delete this appointment" },
        { status: 403 }
      );
    }

    // Delete appointment
    await Appointment.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
