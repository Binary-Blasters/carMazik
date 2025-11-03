import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { sellerController } from "../controllers/seller.controllers.js";
import { checkSellerApproval } from "../middlewares/checkSellerApproval.middlewares.js";

const router = express.Router();

router
  .route("/")
  .post(verifyJWT(), sellerController.applyForSeller) //checked
  .get(                                               //checked
    verifyJWT("seller"),
    checkSellerApproval,
    sellerController.getSellerProfile
  )
  .patch(                                             //checked
    verifyJWT("seller"),
    checkSellerApproval,
    sellerController.updateSellerProfile
  );



export default router;
