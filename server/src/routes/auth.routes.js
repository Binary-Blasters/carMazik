import express from "express"
import { authController } from "../controllers/auth.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = express.Router()
router.route("/register").post(authController.register) //checked
router.route("/login").post(authController.login)  //checked

router.route("/logout").post(verifyJWT(), authController.logout)  //checked


router.route("/send-reset-password-otp").post(authController.sendResetPassOTP)   //checked
router.route("/reset-password").patch(authController.resetPassword) //checked

export default router