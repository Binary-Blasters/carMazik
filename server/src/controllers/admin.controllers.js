import { asyncHandler } from "../utils/asyncHandler.js";
import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { app } from "../app.js";
import { User } from "../models/user.models.js";

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
        throw new ApiError(404, "Seller not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,approvedSeller,"Seller approved")
    )
  }),
  rejectSeller : asyncHandler(async(req ,res) => {
    const {seller_id} = req.params
    const rejectedSeller = await Seller.findByIdAndUpdate(
        seller_id,
        {
            verificationStatus : "rejected"
        },
        {
            new : true
        }
    )

    if (!rejectedSeller) {
        throw new ApiError(404, "Seller not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, rejectedSeller , "Seller rejected")
    )
  }),

  //user
  getAllActiveUsers : asyncHandler(async(req ,res) => {
    const allUsers =await  User.find({role : "user", isBlocked : false})
    if (!allUsers || allUsers.length < 1) {
        throw new ApiError(404, "No Active users")
    }
    return res
    .status(200)
    json(
        new ApiResponse(200, allUsers , "All users featched succesfully")
    )
  }),
  blockUser : asyncHandler(async(req, res) => {
    const {user_id} = req.params
    const blockedUser = User.findByIdAndUpdate(
        user_id,
        {
            isBlocked : true
        },
        {
            new : true
        }
    )
    if (!blockedUser) {
        throw new ApiError(404,"User not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,blockedUser, "User blocked")
    )
  }),
  getBlockedUsers : asyncHandler(async(req, res) => {
    const blockedUsers = await User.find({role : 'user', isBlocked : true})
    if (!blockedUsers || blockedUsers.length < 1) {
      throw new ApiError(404, "No Blocked users")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200,blockedUsers,"Blocked users featched successfully")
    )
  }),
  getUserById : asyncHandler(async(req, res) => {
    const {user_id} = req.params
    const user = await User.findById(user_id)
    if (!user) {
      throw new ApiError(404, "User not found")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200,user,"User fetched successfully")
    )
  }),
  unblockUser : asyncHandler(async(req, res) => {
    const {user_id} = req.params
    const unblockedUser = await User.findByIdAndUpdate(
      user_id,
      {
        isBlocked: false
      },
      {
        new: true
      }
    )
    if (!unblockedUser) {
        throw new ApiError(404, "User not found")
      }
    return res
    .status(200)
    .json(
      new ApiResponse(200, unblockedUser, "User unblocked successfully")
    )
  })
}
