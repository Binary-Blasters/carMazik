import express from "express"
import { userController } from "../controllers/user.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.use(verifyJWT("user"))

router.route("/").get(verifyJWT(), userController.getUserProfile)  //checked
router.route("/").patch(verifyJWT(), userController.updateUserProfile)  //checked
router.route("/change-password").patch(verifyJWT(), userController.changePassword) //checked

//waitnig for car upload route to be created in car.routes.js
router.route("/wishlist/add").post(verifyJWT(), userController.addToWishList)
router.route("/wishlist/remove").delete(verifyJWT(), userController.removeFromWishList)
router.route("/wishlist").get(verifyJWT(), userController.getUserWishList)

export default router