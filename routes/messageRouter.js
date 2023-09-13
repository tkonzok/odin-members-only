import express from 'express';
const router = express.Router();

// Import controller modules.
import * as user_controller from "../controllers/userController.js";
import * as message_controller from "../controllers/messageController.js";

// GET messages listing.
router.get("/", message_controller.message_list);

// GET request for creating a Message.
router.get("/add-message", message_controller.message_create_get);

// POST request for creating a Message.
router.post("/add-message", message_controller.message_create_post);

// GET request for deleting a Message.
router.get("/:id/delete-message", message_controller.message_delete_get);

// POST request for deleting a Message.
router.post("/:id/delete-message", message_controller.message_delete_post);

export default router;