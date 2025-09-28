import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopName: {
      type: String,
      // required: true
    },
    gstNumber: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
    },
    aadhaarNumber: {
      type: String,
      required: true,
    },
    bankDetails: {
      accountNumber: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

   
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "standard", "premium", "enterprise"], 
        default: "free",
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);
