import express from "express";
import { compareCarsBySlug, getCompareDetails, getComparePairs } from "../controllers/compare.controllers.js";

const router = express.Router();

router.route("/pairs").get(getComparePairs);
router.route("/details").get(getCompareDetails);
router.route("/:slug").get(compareCarsBySlug);

export default router;
