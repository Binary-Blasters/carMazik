import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Car } from "../models/car.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import { get } from "http";
import { Seller } from "../models/seller.model.js";
import path from "path";
import sharp from "sharp";

const carController = {
  uploadCar : asyncHandler(async (req, res) => {
  const carData = req.body;
  const carImages = req?.files;
  const seller_id = req.user?.id;

  const seller = await Seller.findOne({ userid: seller_id });
  if (!seller) throw new ApiError(401, "Unauthorized: Seller not found");

  if (!carData || !carImages || carImages.length === 0)
    throw new ApiError(400, "Car data and images are required");

  if (typeof carData.engine === "string") {
    try {
      carData.engine = JSON.parse(carData.engine);
    } catch {
      carData.engine = {};
    }
  }

  if (typeof carData.features === "string") {
    try {
      carData.features = JSON.parse(carData.features);
    } catch {
      carData.features = [];
    }
  }

  carData.price = Number(carData.price) || 0;
  carData.year = Number(carData.year) || null;
  carData.kmDriven = Number(carData.kmDriven) || 0;
  carData.seatingCapacity = Number(carData.seatingCapacity) || 0;

  const uploadDir = path.join(process.cwd(), "public", "images", "cars");
  const watermarkPath = path.join(process.cwd(), "public", "watermark.png");

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const imagePaths = [];
  for (const file of carImages) {
    const inputPath = file.path;
    const wmFilename = `wm-${file.filename}`;
    const outputPath = path.join(uploadDir, wmFilename);

    try {
      if (fs.existsSync(watermarkPath)) {
        const watermark = await sharp(watermarkPath)
          .resize(120)
          .png()
          .toBuffer();

        await sharp(inputPath)
          .composite([{ input: watermark, gravity: "southeast", blend: "over" }])
          .jpeg({ quality: 90 })
          .toFile(outputPath);
      } else {
        await sharp(inputPath).jpeg({ quality: 90 }).toFile(outputPath);
      }

      imagePaths.push(`/images/cars/${wmFilename}`);
      fs.unlinkSync(inputPath);
    } catch (err) {
      console.error(`Watermark failed for: ${file.filename}`, err);
      fs.copyFileSync(inputPath, outputPath);
      imagePaths.push(`/images/cars/${wmFilename}`);
      fs.unlinkSync(inputPath);
    }
  }

  const newCarData = {
    ...carData,
    seller: seller._id,
    images: imagePaths,
    features: Array.isArray(carData.features)
      ? carData.features
      : [],
    engine:
      typeof carData.engine === "object" && carData.engine
        ? carData.engine
        : { capacity: "", power: "", torque: "" },
  };

  try {
    const newCar = await Car.create(newCarData);
    res
      .status(201)
      .json(new ApiResponse(201, "Car uploaded successfully", newCar));
  } catch (error) {
    console.error("❌ Car Save Error:", error);
    for (const img of imagePaths) {
      const filePath = path.join(process.cwd(), "public", img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    throw new ApiError(500, "Failed to save car details. Please try again.");
  }
}),

  getCars: asyncHandler(async (req, res) => {
    try {
      const {
        brand,
        model,
        year,
        minPrice,
        maxPrice,
        fuelType,
        transmission,
        minKm,
        maxKm,
        color,
        search,
        sortBy,
        sortOrder = "asc",
        page = 1,
        limit = 10,
      } = req.query;

      const query = { status: "approved" };

      const brandQuery = brand ? brand.trim() : null;
      const modelQuery = model ? model.trim() : null;

      if (brandQuery) query.brand = { $regex: brandQuery, $options: "i" };
      if (modelQuery) query.model = { $regex: modelQuery, $options: "i" };
      if (year) query.year = Number(year);
      if (fuelType) query.fuelType = fuelType;
      if (transmission) query.transmission = transmission;
      if (color) query.color = color;

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (minKm || maxKm) {
        query.kmDriven = {};
        if (minKm) query.kmDriven.$gte = Number(minKm);
        if (maxKm) query.kmDriven.$lte = Number(maxKm);
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
      } else {
        sortOptions.createdAt = -1;
      }

      const skip = (page - 1) * limit;

      const cars = await Car.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate("seller", "name contact");

      const total = await Car.countDocuments(query);
      console.log(cars);

      res.status(200).json(
        new ApiResponse(
          200,
          {
            total,
            page: Number(page),
            limit: Number(limit),
            cars,
          },
          "Cars fetched successfully"
        )
      );
    } catch (error) {
      throw new ApiError(500, "Failed to fetch cars");
    }
  }),
  latestCar: asyncHandler(async (req, res) => {
    try {
      const cars = await Car.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("seller", "name contact");
      return res
        .status(200)
        .json(new ApiResponse(200, cars, "Latest cars fetched successfully"));
    } catch (error) {
      throw new ApiError(500, "Failed to fetch latest cars");
    }
  }),
  getCarBrands: asyncHandler(async (req, res) => {
    try {
      const brands = await Car.distinct("brand", { status: "approved" });
      return res
        .status(200)
        .json(new ApiResponse(200, brands, "Car brands fetched successfully"));
    } catch (error) {
      throw new ApiError(500, "Failed to fetch car brands");
    }
  }),
  getCarModelsByBrand: asyncHandler(async (req, res) => {
    try {
      const { brand } = req.params;
      const models = await Car.distinct("model", {
        status: "approved",
        brand,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, models, "Car models fetched successfully"));
    } catch (error) {
      throw new ApiError(500, "Failed to fetch car models");
    }
  }),
  getElectricCars: asyncHandler(async (req, res) => {
    try {
      const electricCars = await Car.find({
        status: "approved",
        fuelType: "Electric",
      })
        .sort({ createdAt: -1 })
        .populate("seller", "name contact");
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            electricCars,
            "Electric cars fetched successfully"
          )
        );
    } catch (error) {
      throw new ApiError(500, "Failed to fetch electric cars");
    }
  }),
  getCarById: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const car = await Car.findById(id).populate("seller", "name contact");
      if (!car) {
        throw new ApiError(404, "Car not found");
      }
      return res
        .status(200)
        .json(new ApiResponse(200, car, "Car fetched successfully"));
    } catch (error) {
      throw new ApiError(500, "Failed to fetch car");
    }
  }),
  searchCars: asyncHandler(async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        throw new ApiError(400, "Search query is required");
      }
      const cars = await Car.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }).populate("seller", "name contact");
      return res
        .status(200)
        .json(new ApiResponse(200, cars, "Cars fetched successfully"));
    } catch (error) {
      throw new ApiError(500, "Failed to search cars");
    }
  }),
  getBrandsByFuelType: asyncHandler(async (req, res) => {
    try {
      const { fuelType } = req.params;
      const brands = await Car.distinct("brand", {
        status: "approved",
        fuelType,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, brands, "Car brands fetched successfully"));
    } catch (error) {
      throw new ApiError(500, "Failed to fetch car brands");
    }
  }),
  getSellerPendingCars: asyncHandler(async (req, res) => {
  const seller_id = req.user?.id;

  if (!seller_id) throw new ApiError(401, "Unauthorized: No seller ID provided");

  const seller = await Seller.findOne({ userid: seller_id });
  if (!seller) throw new ApiError(401, "Unauthorized: Seller not found");

  try {
    const cars = await Car.find({ seller: seller._id, status: "pending" })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json(
      new ApiResponse(
        200,
        cars,
        cars.length
          ? "Pending cars fetched successfully"
          : "No pending cars found"
      )
    );
  } catch (error) {
    console.error("❌ Error fetching pending cars:", error);
    throw new ApiError(500, "Failed to fetch pending cars. Please try again.");
  }
}),
getRejectedCars: asyncHandler(async (req, res) => {
  const seller_id = req.user?.id;
  if (!seller_id) throw new ApiError(401, "Unauthorized: No seller ID provided");

  const seller = await Seller.findOne({ userid: seller_id });
  if (!seller) throw new ApiError(401, "Unauthorized: Seller not found");

  try {
    const cars = await Car.find({ seller: seller._id, status: "rejected" })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json(
      new ApiResponse(
        200,
        cars,
        cars.length > 0
          ? "Rejected cars fetched successfully"
          : "No rejected cars found."
      )
    );
  } catch (error) {
    console.error("❌ Error fetching rejected cars:", error);
    throw new ApiError(500, "Failed to fetch rejected cars. Please try again.");
  }
}),
getSoldCars: asyncHandler(async (req, res) => {
  const sellerId = req.user?.id;
  if (!sellerId) throw new ApiError(401, "Unauthorized: No seller ID provided");

 
  const seller = await Seller.findOne({ userid: sellerId });
  if (!seller) throw new ApiError(401, "Unauthorized: Seller not found");

  try {
   
    const soldCars = await Car.find({ seller: seller._id, status: "sold" })
      .sort({ createdAt: -1 })
      .select("-__v");

   
    const message =
      soldCars.length > 0
        ? "✅ Sold cars fetched successfully"
        : "No sold cars found.";

    return res.status(200).json(new ApiResponse(200, soldCars, message));
  } catch (error) {
    console.error("❌ Error fetching sold cars:", error.message);
    throw new ApiError(
      500,
      "Failed to fetch sold cars. Please try again later."
    );
  }
}),




}

export { carController };
