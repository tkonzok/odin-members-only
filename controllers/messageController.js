import User from "../models/users.js";
import Message from "../models/messages.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Debug from "debug";
const debug = Debug("messages")

// Display list of all messages.
export const message_list = asyncHandler(async (req, res, next) => {
    const allMessages = await Message.find()
      .limit(10)
      .populate("author", "-password")
      .sort({ timestamp: -1 })
      .exec();
  
    res.render("message-board", { title: "Message Board", message_list: allMessages });
  });

// render add message page GET
export const message_create_get = (req, res) => res.render("message-form", {title: "Create a new Message"});

// render add message page POST
export const message_create_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
  // Extract the validation errors from a request.
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      author: req.user._id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("message-form", {
        title: "Create a new Message",
        message: message,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save message.
      await message.save();
      res.redirect("/messages");
    }
}),
];

// render delete message page GET
export const message_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of message
  const message = await Message.findById(req.params.id).exec();

  if (message === null || !req.user || !req.user.isAdmin) {
    // No results or not authorized.
    debug(`id not found: ${req.params.id}`);
    res.redirect("/messages");
  }

  res.render("message-delete", {
    message: message
  });
});

// Handle message delete on POST.
export const message_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of messages.
  await Message.findByIdAndRemove(req.body.messageid);
  res.redirect("/messages");
});