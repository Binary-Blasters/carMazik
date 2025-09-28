import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { WishList } from "../models/wishList.model.js";

export const userController = {
  getUserProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .select("-password -isBlocked -__v")
      .lean();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const wishList = await WishList.find({ user: req.user._id }).populate({
      path: "car",
      select: "-__v",
    });

    user.wishList = wishList.map((w) => w.car);

    res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched successfully"));
  }),

  updateUserProfile: asyncHandler(async (req, res) => {
    const { name, username, email, phonenumber } = req.body;
    if (!name || !username || !email || !phonenumber) {
      throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({
      _id: { $ne: req.user._id },
      $or: [{ email }, { username }, { phonenumber }],
    });
    if (existingUser) {
      throw new ApiError(
        409,
        "Email, username, or phone number already in use by another user"
      );
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, username, email, phonenumber },
      { new: true, runValidators: true }
    ).select("-password -role -isBlocked -__v");
    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  }),
  changePassword: asyncHandler(async (req, res) => {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      throw new ApiError(400, "All fields are required");
    }
    if (password === newPassword) {
      throw new ApiError(400, "New password cannot be same as old password");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Worng password ");
    }
    user.password = newPassword;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset succesfully"));
  }),
  addToWishList: asyncHandler(async (req, res) => {
    const { carId } = req.body;
    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      throw new ApiError(400, "Valid carId is required");
    }
    let wishList = await WishList.findOne({ user: req.user._id });
    if (!wishList) {
      wishList = new WishList({ user: req.user._id, cars: [carId] });
    } else {
      if (wishList.cars.includes(carId)) {
        throw new ApiError(409, "Car already in wishlist");
      }
      wishList.cars.push(carId);
    }
    await wishList.save();
    res
      .status(200)
      .json(new ApiResponse(200, wishList, "Car added to wishlist successfully"));
  }),
  removeFromWishList: asyncHandler(async (req, res) => {
    const { carId } = req.body;
    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      throw new ApiError(400, "Valid carId is required");
    }
    const wishList = await WishList.findOne({ user: req.user._id });
    if (!wishList || !wishList.cars.includes(carId)) {
      throw new ApiError(404, "Car not found in wishlist");
    }
    wishList.cars = wishList.cars.filter((c) => c.toString() !== carId);
    await wishList.save();
    res
      .status(200)
      .json(new ApiResponse(200, wishList, "Car removed from wishlist successfully"));
  }),
  getUserWishList: asyncHandler(async (req, res) => {
    const wishList = await WishList.findOne({ user: req.user._id }).populate({
      path: "cars",
      select: "-__v",
    });
    res
      .status(200)
      .json(new ApiResponse(200, wishList ? wishList.cars : [], "Wishlist fetched successfully"));
  }),
}
