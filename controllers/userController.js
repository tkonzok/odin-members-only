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

// render home page
export const index = (req, res) => res.render("index", { user: req.user });

// render sign up page GET
export const user_create_get = (req, res) => res.render("sign-up-form", {title: "Create a new User"});

// render sign up page POST
export const user_create_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be of at least 8 characters.")
    .trim()
    .isLength({ min: 8 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
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
                title: "Create a new User",
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
}),
];

// render log in page GET
export const user_login_get = (req, res) => res.render("log-in-form", {title: "Log In"});

// render log in page POST
export const user_login_post = passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    });

// log out GET
export const user_logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};