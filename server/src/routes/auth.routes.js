import express from "express"
import { authController } from "../controllers/auth.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = express.Router()
router.route("/register").post(authController.register)
router.route("/login").post(authController.login)
router.route("/logout").post(verifyJWT(),authController.logout)
// router.route("/reset-password").post(verifyJWT(),authController.resetPassword)

export default router