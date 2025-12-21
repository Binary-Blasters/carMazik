import { asyncHandler } from "../utils/asyncHandler.js";
import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { app } from "../app.js";
import { User } from "../models/user.models.js";
import { Car } from "../models/car.models.js";

export const adminController = {
  getPendingSellers: asyncHandler(async (req, res) => {
    const pendingSellers = await Seller.find({
      verificationStatus: "pending",
    }).populate("userid", "name email phonenumber");
    if (!pendingSellers || pendingSellers.length === 0) {
      throw new ApiError(404, "No pending sellers");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, pendingSellers, "Pending sellers are fetched")
      );
  }),
  getPendingSellersById: asyncHandler(async (req, res) => {
    const { seller_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(seller_id)) {
      throw new ApiError(400, "Invalid seller ID");
    }
    const seller = await Seller.findById(seller_id).populate(
      "userid",
      "name email phonenumber"
    );
    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, seller, "Seller id featched"));
  }),
  approveSeller: asyncHandler(async (req, res) => {
    const { seller_id } = req.params;

    const approvedSeller = await Seller.findByIdAndUpdate(
      seller_id,
      { verificationStatus: "approved" },
      { new: true }
    );
    if (!approvedSeller) {
      throw new ApiError(404, "Seller not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, approvedSeller, "Seller approved"));
  }),
  rejectSeller: asyncHandler(async (req, res) => {
    const { seller_id } = req.params;
    const rejectedSeller = await Seller.findByIdAndUpdate(
      seller_id,
      {
        verificationStatus: "rejected",
      },
      {
        new: true,
      }
    );

    if (!rejectedSeller) {
      throw new ApiError(404, "Seller not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, rejectedSeller, "Seller rejected"));
  }),
  getAllActiveSellers: asyncHandler(async (req, res) => {
    const allSellers = await Seller.find({ verificationStatus: "approved" });
    if (!allSellers || allSellers.length < 1) {
      throw new ApiError(404, "No Active sellers");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, allSellers, "All active sellers featched")
      );
  }),
  blockSeller: asyncHandler(async (req, res) => {
    const { seller_id } = req.params;
    const blockedSeller = await Seller.findByIdAndUpdate(
      seller_id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    if (!blockedSeller) {
      throw new ApiError(404, "Seller not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, blockedSeller, "Seller blocked"));
  }),
  unblockSeller: asyncHandler(async (req, res) => {
    const { seller_id } = req.params;
    const unblockedSeller = await Seller.findByIdAndUpdate(
      seller_id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    if (!unblockedSeller) {
      throw new ApiError(404, "Seller not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, unblockedSeller, "Seller unblocked"));
  }),
  getBLockedSellers: asyncHandler(async (req, res) => {
    const blockedSellers = await Seller.find({ isBlocked: true }); 
    if (!blockedSellers || blockedSellers.length < 1) {
      throw new ApiError(404, "No Blocked sellers");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          blockedSellers,
          "Blocked sellers fetched successfully"
        )
      );
  }),

  //user
  getAllActiveUsers: asyncHandler(async (req, res) => {
    const allUsers = await User.find({ role: "user", isBlocked: false });
    if (!allUsers || allUsers.length < 1) {
      throw new ApiError(404, "No Active users");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, allUsers, "All users featched succesfully"));
  }),
  blockUser: asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const blockedUser = await User.findByIdAndUpdate(
      user_id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    if (!blockedUser) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, blockedUser, "User blocked"));
  }),
  getBlockedUsers: asyncHandler(async (req, res) => {
    const blockedUsers = await User.find({ role: "user", isBlocked: true });
    if (!blockedUsers || blockedUsers.length < 1) {
      throw new ApiError(404, "No Blocked users");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          blockedUsers,
          "Blocked users featched successfully"
        )
      );
  }),
  getUserById: asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  }),
  unblockUser: asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const unblockedUser = await User.findByIdAndUpdate(
      user_id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    if (!unblockedUser) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, unblockedUser, "User unblocked successfully"));
  }),

  //cars

  getPendingCars: asyncHandler(async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1; // default page 1
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const pendingCars = await Car.find({ status: "pending" })
      .skip(skip)
      .limit(limit)
      .populate("seller", "name contact")
      .sort({ createdAt: -1 });

    const totalPending = await Car.countDocuments({ status: "pending" });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total: totalPending,
          page,
          limit,
          cars: pendingCars,
        },
        "Pending cars fetched successfully"
      )
    );
  }),

  approveCar: asyncHandler(async (req, res) => {
    const { car_id } = req.params;

    const approvedCar = await Car.findByIdAndUpdate(
      car_id,
      { status: "approved" },
      { new: true }
    );
    if (!approvedCar) {
      throw new ApiError(404, "Car not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, approvedCar, "Car approved"));
  }),

 rejectCar: asyncHandler(async (req, res) => {
  const { car_id } = req.params;
  const { reason } = req.body; // optional rejection reason (sent from admin panel)

  if (!car_id) {
    throw new ApiError(400, "Car ID is required to reject a car");
  }

  const car = await Car.findById(car_id);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  if (car.status === "rejected") {
    throw new ApiError(400, "Car is already rejected");
  }

  car.status = "rejected";
  car.rejectionReason = reason || "No reason provided";
  car.rejectedAt = new Date();

  await car.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, car, "Car has been successfully rejected.")
    );
}),

getStats: asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalSellers = await Seller.countDocuments({ verificationStatus: "approved" });
  const totalCars = await Car.countDocuments({ status: "approved" });
  const pendingCars = await Car.countDocuments({ status: "pending" });
  const pendingSellers = await Seller.countDocuments({ verificationStatus: "pending" });
  const blockedUsers = await User.countDocuments({ role: "user", isBlocked: true });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalSellers,
        totalCars,
        pendingCars,
        pendingSellers,
        blockedUsers,
      },
      "Statistics fetched successfully"
    )
  )
}),
};