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

// GET endpoint to retrieve a specific appointment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get appointment ID from URL parameter
    const appointmentId = params.id;

    // Connect to database
    await dbConnect();

    // Find appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate("customer", "firstName lastName email -_id")
      .populate("salon", "name address -_id");

    // Check if appointment exists
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to view this appointment
    if (session.user.userType === "business") {
      // Business users can only view appointments for their salons
      const salons = await Salon.find({ owner: session.user.id }).select("_id");
      const salonIds = salons.map((salon) => salon._id.toString());

      if (!salonIds.includes(appointment.salon._id.toString())) {
        return NextResponse.json(
          { error: "You don't have permission to view this appointment" },
          { status: 403 }
        );
      }
    } else {
      // Customers can only view their own appointments
      if (appointment.customer._id.toString() !== session.user.id) {
        return NextResponse.json(
          { error: "You don't have permission to view this appointment" },
          { status: 403 }
        );
      }
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

// PATCH endpoint to update an appointment's status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get appointment ID from URL parameter
    const appointmentId = params.id;

    // Get request body
    const body = await req.json();
    const { status } = body;

    // Validate status
    if (
      !status ||
      !["pending", "confirmed", "completed", "cancelled"].includes(status)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Must be one of: pending, confirmed, completed, cancelled",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find appointment
    const appointment = await Appointment.findById(appointmentId);

    // Check if appointment exists
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check permissions
    if (session.user.userType === "business") {
      // Business users can only update appointments for their salons
      const salons = await Salon.find({ owner: session.user.id }).select("_id");
      const salonIds = salons.map((salon) => salon._id.toString());

      if (!salonIds.includes(appointment.salon.toString())) {
        return NextResponse.json(
          { error: "You don't have permission to update this appointment" },
          { status: 403 }
        );
      }
    } else {
      // Customers can only cancel their own appointments
      if (appointment.customer.toString() !== session.user.id) {
        return NextResponse.json(
          { error: "You don't have permission to update this appointment" },
          { status: 403 }
        );
      }

      // Customers can only cancel appointments, not confirm or complete them
      if (status !== "cancelled") {
        return NextResponse.json(
          { error: "Customers can only cancel appointments" },
          { status: 403 }
        );
      }
    }

    // Update appointment status
    appointment.status = status;
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
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get appointment ID from URL parameter
    const appointmentId = params.id;

    // Connect to database
    await dbConnect();

    // Find appointment
    const appointment = await Appointment.findById(appointmentId);

    // Check if appointment exists
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check permissions
    if (session.user.userType === "business") {
      // Business users can only delete appointments for their salons
      const salons = await Salon.find({ owner: session.user.id }).select("_id");
      const salonIds = salons.map((salon) => salon._id.toString());

      if (!salonIds.includes(appointment.salon.toString())) {
        return NextResponse.json(
          { error: "You don't have permission to delete this appointment" },
          { status: 403 }
        );
      }
    } else {
      // Customers can only delete their own appointments
      if (appointment.customer.toString() !== session.user.id) {
        return NextResponse.json(
          { error: "You don't have permission to delete this appointment" },
          { status: 403 }
        );
      }

      // Check if appointment is within 24 hours
      const appointmentDate = new Date(appointment.date);
      const now = new Date();
      const diffInHours =
        (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return NextResponse.json(
          { error: "Cannot delete appointments less than 24 hours in advance" },
          { status: 403 }
        );
      }
    }

    // Delete appointment
    await Appointment.findByIdAndDelete(appointmentId);

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
