import { asyncHandler } from "../utils/asyncHandler.js";
import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Car } from "../models/car.models.js";

export const checkCarLimit = asyncHandler(async (req, res ,next) => {
  const seller = await Seller.findById(req?.user?._id);

  if (!seller) {
    throw new ApiError(403, "Seller profile not found");
  }
  if (
    !seller.subscription.isActive ||
    new Date() > seller.subscription.endDate
  ) {
    throw new ApiError(403, "Your subscription is inactive or expired");
  }

  let limit;
  switch (seller.subscription.plan) {
    case "free":
      limit = 2;
      break;
    case "basic":
      limit = 10;
      break;
    case "standard":
      limit = 25;
      break;
    case "premium":
      limit = 50;
      break;
    case "enterprise":
      limit = Infinity;
      break;
    default:
      limit = 0;
  }

  if (limit !== Infinity) {
    const carCount = await Car.countDocuments({ seller: seller._id });
    if (carCount >= limit) {
      throw new ApiError(
        403,
        `You have reached your ${seller.subscription.plan} plan limit of ${limit} cars.`
      );
    }
  }
  next();
});
