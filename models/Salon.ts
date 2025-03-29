import mongoose from "mongoose";

// Define the interface for the Service document
interface IService {
  name: string;
  category: string;
  minDuration: number;
  maxDuration: number;
  price: number;
  description?: string;
}

// Define the Service schema
const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Service name is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Service category is required"],
    enum: ["Hair Styling", "Nails", "Face and Body"],
    trim: true,
  },
  minDuration: {
    type: Number,
    required: [true, "Minimum duration is required"],
    min: [5, "Minimum duration must be at least 5 minutes"],
  },
  maxDuration: {
    type: Number,
    required: [true, "Maximum duration is required"],
    min: [5, "Maximum duration must be at least 5 minutes"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  description: {
    type: String,
    trim: true,
  },
});

// Define the interface for the Salon document
export interface ISalon extends mongoose.Document {
  name: string;
  slogan?: string;
  owner: mongoose.Types.ObjectId;
  gender: "Male" | "Female" | "Unisex";
  email: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  postalCode: string;
  services: IService[];
  logo?: string;
  gallery?: string[];
  rating?: number;
  reviews?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Salon schema
const SalonSchema = new mongoose.Schema<ISalon>(
  {
    name: {
      type: String,
      required: [true, "Salon name is required"],
      trim: true,
    },
    slogan: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Salon owner is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Unisex"],
      required: [true, "Salon gender type is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    district: {
      type: String,
      required: [true, "District is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
    },
    services: [ServiceSchema],
    logo: {
      type: String,
    },
    gallery: [String],
    rating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot be higher than 5"],
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create and export the Salon model
export default mongoose.models.Salon ||
  mongoose.model<ISalon>("Salon", SalonSchema);
