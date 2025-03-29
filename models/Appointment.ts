import mongoose from "mongoose";

// Define the interface for the Appointment document
export interface IAppointment extends mongoose.Document {
  customer: mongoose.Types.ObjectId;
  salon: mongoose.Types.ObjectId;
  service: {
    name: string;
    category: string;
    duration: number;
    price: number;
  };
  date: Date;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Appointment schema
const AppointmentSchema = new mongoose.Schema<IAppointment>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: [true, "Salon is required"],
    },
    service: {
      name: {
        type: String,
        required: [true, "Service name is required"],
      },
      category: {
        type: String,
        required: [true, "Service category is required"],
        enum: ["Hair Styling", "Nails", "Face and Body"],
      },
      duration: {
        type: Number,
        required: [true, "Service duration is required"],
        min: [5, "Duration must be at least 5 minutes"],
      },
      price: {
        type: Number,
        required: [true, "Service price is required"],
        min: [0, "Price cannot be negative"],
      },
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Start time must be in 24hr format (HH:MM)",
      ],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "End time must be in 24hr format (HH:MM)",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Appointment model
export default mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
