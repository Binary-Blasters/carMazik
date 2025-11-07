import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkSellerApproval } from "../middlewares/checkSellerApproval.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { carController } from "../controllers/car.controllers.js";

const router = express.Router();

router.route("/").get(carController.getCars); //checked
router.route("/latest").get(carController.latestCar); //checked
router.route("/brands").get(carController.getCarBrands); //checked
router.route("/models/:brand").get(carController.getCarModelsByBrand); //checked
router.route("/electric").get(carController.getElectricCars); //checked

router.use(verifyJWT());
router.route("/search").get(carController.searchCars); //checked
router.route("/:id").get(carController.getCarById); //checked
router.route("/fuel-type/:fuelType/brands").get(carController.getBrandsByFuelType); //checked

router.use(verifyJWT("seller")); 
router.use(checkSellerApproval);
router
  .route("/")
  
  .post(
    upload.array("images"),
    carController.uploadCar                //checked
  );

export default router;
