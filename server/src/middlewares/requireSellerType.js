import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";

export const requireSellerType = (type) => {
  return async (req, res, next) => {
    const seller = await Seller.findOne({ userid: req.user.id });

    if (!seller)
      throw new ApiError(403, "Seller not found");

    if (!seller.sellerTypes.includes(type))
      throw new ApiError(403, `Access denied for ${type}`);

    next();
  };
};
