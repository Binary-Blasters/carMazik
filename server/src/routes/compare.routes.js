import express from "express";
import { getComparePairs } from "../controllers/compare.controllers.js";

const router = express.Router();

router.route("/pairs").get(getComparePairs);

export default router;
