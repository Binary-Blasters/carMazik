import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Car } from "../models/car.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import { get } from "http";
import { Seller } from "../models/seller.model.js";
import path from "path";
import sharp from "sharp";
import { safeUnlink } from "../utils/safeUnlink.js";

const carController = {
  uploadCar: asyncHandler(async (req, res) => {
    const carData = req.body;
    const carImages = req.files;
    const sellerUserId = req.user?.id;

    /* ---------------- SELLER CHECK ---------------- */
    const seller = await Seller.findOne({ userid: sellerUserId });
    if (!seller) {
      throw new ApiError(401, "Unauthorized: Seller not found");
    }

    if (!carData || !carImages || carImages.length === 0) {
      throw new ApiError(400, "Car data and images are required");
    }

    /* ---------------- PARSE JSON FIELDS ---------------- */

    const parseJSON = (value, fallback) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return fallback;
        }
      }
      return value || fallback;
    };

    carData.engine = parseJSON(carData.engine, {
      capacity: "",
      power: "",
      torque: "",
    });

    carData.battery = parseJSON(carData.battery, {
      range: "",
      chargingTime: "",
    });

    carData.cng = parseJSON(carData.cng, {
      tankCapacity: "",
    });

    carData.features = parseJSON(carData.features, []);

    /* ---------------- NUMBER FIELDS ---------------- */
    carData.price = Number(carData.price) || 0;
    carData.year = Number(carData.year) || null;
    carData.kmDriven = Number(carData.kmDriven) || 0;
    carData.seatingCapacity = Number(carData.seatingCapacity) || 0;

    /* ---------------- IMAGE PATHS ---------------- */
    const uploadDir = path.join(process.cwd(), "public", "images", "cars");
    const watermarkPath = path.join(process.cwd(), "public", "watermark.png");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePaths = [];

    /* ---------------- IMAGE PROCESSING ---------------- */
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
            .composite([
              {
                input: watermark,
                gravity: "southeast",
                blend: "over",
              },
            ])
            .jpeg({ quality: 90 })
            .toFile(outputPath);
        } else {
          await sharp(inputPath).jpeg({ quality: 90 }).toFile(outputPath);
        }

        imagePaths.push(`/images/cars/${wmFilename}`);
        await safeUnlink(inputPath);
      } catch (err) {
        console.error("❌ Image processing failed:", err);

        // fallback
        await fs.promises.copyFile(inputPath, outputPath);
        imagePaths.push(`/images/cars/${wmFilename}`);
        await safeUnlink(inputPath);
      }
    }

    /* ---------------- FINAL CAR OBJECT ---------------- */

    const newCarData = {
      title: carData.title,
      brand: carData.brand,
      model: carData.model,
      variant: carData.variant,
      bodyType: carData.bodyType,

      year: carData.year,
      price: carData.price,
      negotiable: carData.negotiable === "true" || carData.negotiable === true,

      fuelType: carData.fuelType,
      transmission: carData.transmission,

      kmDriven: carData.kmDriven,
      ownership: carData.ownership,
      color: carData.color,
      mileage: carData.mileage,
      seatingCapacity: carData.seatingCapacity,
      location: carData.location,

      engine: ["Petrol", "Diesel", "Hybrid"].includes(carData.fuelType)
        ? carData.engine
        : undefined,

      battery: ["Electric", "Hybrid"].includes(carData.fuelType)
        ? carData.battery
        : undefined,

      cng: carData.fuelType === "CNG" ? carData.cng : undefined,

      features: Array.isArray(carData.features) ? carData.features : [],
      description: carData.description,

      images: imagePaths,
      seller: seller._id,
      status: "pending",
    };

    /* ---------------- SAVE TO DB ---------------- */
    try {
      const newCar = await Car.create(newCarData);

      sharp.cache(false);

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            newCar,
            "Car uploaded successfully and sent for approval"
          )
        );
    } catch (error) {
      console.error("❌ Car save error:", error);

      // cleanup images if DB fails
      for (const img of imagePaths) {
        const filePath = path.join(process.cwd(), "public", img);
        await safeUnlink(filePath);
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
        bodyType,
        transmission,
        minKm,
        maxKm,
        color,
        search,
        sortBy,
        sortOrder = "asc",
        page = 1,
        limit = 10,
        category,
      } = req.query;

      const query = { status: "approved" };

      if (brand?.trim()) query.brand = { $regex: brand.trim(), $options: "i" };
      if (model?.trim()) query.model = { $regex: model.trim(), $options: "i" };
      if (year) query.year = Number(year);
      if (fuelType) {
        query.fuelType = {
          $regex: `^${fuelType}$`,
          $options: "i",
        };
      }
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
      if (bodyType) {
        query.bodyType = { $regex: `^${bodyType}$`, $options: "i" };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { model: { $regex: search, $options: "i" } },
        ];
      }

      const sortOptions = {};

      if (category === "latest") {
        sortOptions.createdAt = -1;
      } else if (category === "popular") {
        sortOptions.views = -1;
      } else if (category === "featured") {
        query.featured = true;
        sortOptions.createdAt = -1;
      } else if (category === "featured") {
        query.featured = true;
        sortOptions.createdAt = -1;
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

      res.status(200).json(
        new ApiResponse(
          200,
          {
            total,
            page: Number(page),
            limit: Number(limit),
            cars,
          },
          cars.length
            ? "Cars fetched successfully"
            : "No cars found for the applied filters"
        )
      );
    } catch (error) {
      console.error("❌ Error fetching cars:", error);
      throw new ApiError(500, "Failed to fetch cars. Please try again.");
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

    if (!seller_id)
      throw new ApiError(401, "Unauthorized: No seller ID provided");

    const seller = await Seller.findOne({ userid: seller_id });
    if (!seller) throw new ApiError(401, "Unauthorized: Seller not found");

    try {
      const cars = await Car.find({ seller: seller._id, status: "pending" })
        .sort({ createdAt: -1 })
        .select("-__v");

      return res
        .status(200)
        .json(
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
      throw new ApiError(
        500,
        "Failed to fetch pending cars. Please try again."
      );
    }
  }),
  getRejectedCars: asyncHandler(async (req, res) => {
    const seller_id = req.user?.id;
    if (!seller_id)
      throw new ApiError(401, "Unauthorized: No seller ID provided");

    const seller = await Seller.findOne({ userid: seller_id });
    if (!seller) throw new ApiError(401, "Unauthorized: Seller not found");

    try {
      const cars = await Car.find({ seller: seller._id, status: "rejected" })
        .sort({ createdAt: -1 })
        .select("-__v");

      return res
        .status(200)
        .json(
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
      throw new ApiError(
        500,
        "Failed to fetch rejected cars. Please try again."
      );
    }
  }),
  getSoldCars: asyncHandler(async (req, res) => {
    const sellerId = req.user?.id;
    if (!sellerId)
      throw new ApiError(401, "Unauthorized: No seller ID provided");

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
  getCarCategoryStats: asyncHandler(async (req, res) => {
    const stats = await Car.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$bodyType",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = stats.reduce((acc, cur) => {
      acc[cur._id.toLowerCase()] = cur.count;
      return acc;
    }, {});

    res
      .status(200)
      .json(new ApiResponse(200, formatted, "Category stats fetched"));
  }),
};

export { carController };
