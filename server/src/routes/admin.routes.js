import express from "express"
import { adminController } from "../controllers/admin.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.use(verifyJWT("admin"))
router.route("/sellers/pending").get(adminController.getPendingSellers)
router.route("/sellers/pending/:seller_id").get(adminController.getPendingSellersById)
router.route("/sellers/approve/:seller_id").patch(adminController.approveSeller)
router.route("/sellers/reject/:seller_id").patch(adminController.rejectSeller)

//user
router.route("/users").get(adminController.getAllActiveUsers)
router.route("/users/block/:user_id").patch(adminController.blockUser)
router.route("/users/unblock/:user_id").patch(adminController.unblockUser)
router.route("/users/:user_id").get(adminController.getUserById)
router.route("/users/blocked").get(adminController.getBlockedUsers)

export default router