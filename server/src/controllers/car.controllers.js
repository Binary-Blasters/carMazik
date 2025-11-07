import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Car } from "../models/car.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import { get } from "http";

const carController = {
  uploadCar: asyncHandler(async (req, res) => {
    const carData = req.body;
    const carImages = req?.files;
    const seller_id = req.user.id;

    if (!carData || !carImages || carImages.length === 0) {
      throw new ApiError(400, "Car data and images are required");
    }

    const imagePaths = carImages.map((file) => file.path);

    const newCar = new Car({
      ...carData,
      seller: seller_id,
      images: imagePaths,
    });

    try {
      await newCar.save();
      return res
        .status(201)
        .json(new ApiResponse(201, "Car uploaded successfully", newCar));
    } catch (error) {
      // Delete uploaded images if save fails
      imagePaths.forEach((path) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path); // delete the file
        }
      });
      throw new ApiError(500, "Failed to create car");
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
      return res.status(200).json(
        new ApiResponse(200, cars, "Latest cars fetched successfully")
      );
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
      const electricCars = await Car.find({ status: "approved", fuelType: "Electric" })
        .sort({ createdAt: -1 })
        .populate("seller", "name contact");
      return res
        .status(200)
        .json(
          new ApiResponse(200, electricCars, "Electric cars fetched successfully")
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
      return res.status(200).json(new ApiResponse(200, car, "Car fetched successfully"));
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
      return res.status(200).json(new ApiResponse(200, cars, "Cars fetched successfully"));
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

};

export { carController };
