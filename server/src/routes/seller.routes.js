import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { sellerController } from "../controllers/seller.controllers.js";
import { checkSellerApproval } from "../middlewares/checkSellerApproval.middlewares.js";

const router = express.Router();

router
  .route("/")
  .post(verifyJWT(), sellerController.applyForSeller)
  .get(
    verifyJWT("seller"),
    checkSellerApproval,
    sellerController.getSellerProfile
  );

export default router;
