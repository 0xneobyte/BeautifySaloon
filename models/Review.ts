import mongoose from "mongoose";

// Define the interface for the Review document
export interface IReview extends mongoose.Document {
  customer: mongoose.Types.ObjectId;
  salon: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Review schema
const ReviewSchema = new mongoose.Schema<IReview>(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be higher than 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [3, "Comment must be at least 3 characters long"],
      maxlength: [500, "Comment cannot be longer than 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Review model
export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
