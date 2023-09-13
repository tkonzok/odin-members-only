import express from 'express';
const router = express.Router();

// Require controller modules.
import * as user_controller from "../controllers/userController.js";
// import * as message_controller from "../controllers/messageController.js";

// GET home page.
router.get("/", user_controller.index);

// GET request for creating a User.
router.get("/sign-up", user_controller.user_create_get);

// POST request for creating User.
router.post("/sign-up", user_controller.user_create_post);

export default router;