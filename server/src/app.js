import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import carRouter from "./routes/car.routes.js";
import upcomingCarRouter from "./routes/upComingCar.routes.js";
import compareRoutes from "./routes/compare.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100,               
  message: "Too many requests, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter)


const staticPath = path.resolve(__dirname, "../public");
console.log("🗂️ Serving static from:", staticPath);
app.use("/images", express.static(path.join(staticPath, "images")));



app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/admin/upcoming-cars", upcomingCarRouter);
app.use("/api/v1/compare", compareRoutes);

app.get("/test-path", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/images/cars/1762628845890-09.webp"));
});

app.get("/", (req, res) => {
  res.send("🚀 Server is running and static files are served correctly!");
});

export { app };
