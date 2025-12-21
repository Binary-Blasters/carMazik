import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";

export const isSellerBlocked = async (req, res, next) => {
    const seller = req.user;
    const isBlocked = await Seller.findById(seller._id).select("isBlocked");
    if (isBlocked && isBlocked.isBlocked) {
        return res.status(403).json(new ApiError(403, "Seller account is blocked"));
    }
    next();
};