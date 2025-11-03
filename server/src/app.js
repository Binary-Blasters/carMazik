import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import sellerRouter from "./routes/seller.routes.js"
import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import carRouter from "./routes/car.routes.js"

const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/seller",sellerRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/cars",carRouter)

export {app}