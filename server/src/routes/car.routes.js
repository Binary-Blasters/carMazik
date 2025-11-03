import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkSellerApproval } from "../middlewares/checkSellerApproval.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { carController } from "../controllers/car.controllers.js";

const router = express.Router();

router.route("/").get(carController.getCars); //checked

router.use(verifyJWT("seller")); 
router.use(checkSellerApproval);
router
  .route("/")
  
  .post(
    upload.array("images"),
    carController.uploadCar                //checked
  );

export default router;
