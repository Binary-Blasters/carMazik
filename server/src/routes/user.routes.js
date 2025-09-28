import express from "express"
import { userController } from "../controllers/user.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.use(verifyJWT("user"))

router.route("/").get(userController.getUserProfile)
router.route("/").patch(userController.updateUserProfile)
router.route("/change-password").patch(userController.changePassword)
router.route("/wishlist/add").post(userController.addToWishList)
router.route("/wishlist/remove").delete(userController.removeFromWishList)
router.route("/wishlist").get(userController.getUserWishList)

export default router