import User from "../models/users.js";
import Message from "../models/messages.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Debug from "debug";
const debug = Debug("users")
import passport from "passport";
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from "passport-local";

// Setting up Passport LocalStrategy
passport.use(
    new LocalStrategy(async(username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });

export const index = (req, res) => res.render("index", { user: req.user });

export const user_create_get = (req, res) => res.render("sign-up-form");

export const user_create_post = asyncHandler(async (req, res, next) => {
  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()

  // Process request after validation and sanitization.

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          const user = new User({
              name: req.body.name,
              username: req.body.username,
              password: hashedPassword
          });
          if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render("sign-up-form", {
              user: user,
              errors: errors.array()
            });
          } else {
            // Data from form is valid. Save item.
            const result = await user.save();
            res.redirect("/");
          }  
        });
  } catch(err) {
    return next(err);
  };
})

/*

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
    // Get all categories, which we can use for adding to our item.
    const allCategories = await Category.find().exec();
  
    res.render("item_form", {
      title: "Create Item",
      categories: allCategories,
    });
  });
  
  // Handle item create on POST.
  exports.item_create_post = [
    // Convert the category to an array.
    (req, res, next) => {
      if (!(req.body.category instanceof Array)) {
        if (typeof req.body.category === "undefined") req.body.category = [];
        else req.body.category = new Array(req.body.category);
      }
      next();
    },
  
    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("description", "Description must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("category.*").escape(),
    body("price", "Price must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("numberInStock", "Stock must not be empty").trim().isInt().escape(),
    // Process request after validation and sanitization.
  
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a Item object with escaped and trimmed data.
      const item = new Item({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        // Get all items and categories for form.
        const allCategories = await Category.find().exec();
  
        // Mark our selected categories as checked.
        for (const category of allCategories) {
          if (item.category.includes(category._id)) {
            category.checked = "true";
          }
        }
        res.render("item_form", {
          title: "Create Item",
          categories: allCategories,
          item: item,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save item.
        await item.save();
        res.redirect(item.url);
      }
    }),
  ];

  */