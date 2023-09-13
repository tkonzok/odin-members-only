import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from "./routes/indexRouter.js";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js"; 

import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
}

const app = express();
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/messages', messageRouter);

/*

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get("/", (req, res) => {
    res.render("index", { user: req.user });
  });
app.get("/sign-up", (req, res) => res.render("sign-up-form"));


app.post("/sign-up", async (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: hashedPassword,
                membership_status: req.body.membership_status
            });
            const result = await user.save();
          });
      
      
      res.redirect("/");
    } catch(err) {
      return next(err);
    };
  });

app.post(
    "/log-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
  );

app.get("/log-out", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

  */

app.listen(3000, () => console.log("app listening on port 3000!"));