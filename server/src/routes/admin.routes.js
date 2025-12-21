import express from "express"
import { adminController } from "../controllers/admin.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.use(verifyJWT("admin"))
router.route("/sellers").get(adminController.getAllActiveSellers)
router.route("/sellers/pending").get(adminController.getPendingSellers) //checked
router.route("/sellers/pending/:seller_id").get(adminController.getPendingSellersById) //checked
router.route("/sellers/approve/:seller_id").patch(adminController.approveSeller)    //checked
router.route("/sellers/reject/:seller_id").patch(adminController.rejectSeller)

//user
router.route("/users/blocked").get(adminController.getBlockedUsers)  //checked

router.route("/users").get(adminController.getAllActiveUsers) //checked
router.route("/users/block/:user_id").patch(adminController.blockUser) //checked
router.route("/users/unblock/:user_id").patch(adminController.unblockUser) //checked
router.route("/users/:user_id").get(adminController.getUserById)  //checked


//cars 
router.route("/cars/pending").get(adminController.getPendingCars)  //checked
router.route("/cars/approve/:car_id").patch(adminController.approveCar)  //checked
router.route("/cars/reject/:car_id").patch(adminController.rejectCar) //checked

export default router