// routes/upcomingCar.routes.js
import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getUpcomingCars,
  addUpcomingCar,
  updateUpcomingCar,
  launchUpcomingCar,
  getLaunchedCars,
} from "../controllers/upcomingCar.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.get("/", getUpcomingCars);
router.get("/launched", getLaunchedCars);


router.use(verifyJWT("admin"));

router.post("/",upload.array("images", 8), addUpcomingCar);
router.put("/:id", upload.array("images", 8),updateUpcomingCar);
router.patch("/launch/:id", launchUpcomingCar);

export default router;
