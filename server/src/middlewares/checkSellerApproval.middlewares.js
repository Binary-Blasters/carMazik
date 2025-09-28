import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkSellerApproval = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findOne({userid : req.user?._id});
  if (!seller) {
    throw new ApiError(403, "You are not registered as a seller");
  }
  if (seller.verificationStatus === "pending") {
    throw new ApiError(403, "Your seller account is pending approval");
  }

  if (seller.verificationStatus === "rejected") {
    throw new ApiError(403, "Your seller application has been rejected");
  }
  next();
});
