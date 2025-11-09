import { Seller } from "../models/seller.model.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Car } from "../models/car.models.js";

const sellerController = {
  applyForSeller: asyncHandler(async (req, res) => {
    const {
      shopName,
      gstNumber,
      panNumber,
      aadhaarNumber,
      accountNumber,
      ifscCode,
      address,
    } = req.body;
    const existingSeller = await Seller.findOne({ userid: req.user?._id });
    if (existingSeller) {
      throw new ApiError(400, "You have already applied as a seller");
    }

    const seller = await Seller.create({
      userid: req.user?._id,
      shopName,
      gstNumber,
      panNumber,
      aadhaarNumber,
      bankDetails: { accountNumber, ifscCode },
      address,
    });
    await User.findByIdAndUpdate(req.user?._id, { role: "seller" });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          seller,
          "Seller application submitted successfully"
        )
      );
  }),
  getSellerProfile: asyncHandler(async (req, res) => {
    const seller = await Seller.findOne({ userid: req.user?._id }).populate(
      "userid",
      "-password -role -isBlocked -createdAt -updatedAt -__v"
    );
    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, seller, "Seller profile fetched successfully")
      );
  }),
  updateSellerProfile: asyncHandler(async (req, res) => {
    const { shopName, gstNumber, accountNumber, ifscCode, address } = req.body;

    const seller = await Seller.findOneAndUpdate(
      { userid: req.user?._id },
      {
        shopName,
        gstNumber,
        bankDetails: { accountNumber, ifscCode },
        address,
      },
      { new: true }
    );
    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, seller, "Seller profile updated successfully")
      );
  }),
  getApprovedCars: asyncHandler(async (req, res) => {
    const seller = await Seller.findOne({ userid: req.user?._id });
    if (!seller) {
      throw new ApiError(404, "Seller not found");
    }
   

    const cars = await Car.find({
      seller: seller._id,
      status: "approved",
      isSold: false,
    }).populate("seller", "name email phone");

    if (cars.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No approved cars found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, cars, "Approved cars fetched successfully"));
  }),
};

export { sellerController };
