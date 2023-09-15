import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from "./routes/index.js";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js"; 
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";

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
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});

app.set('port', 8080);
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "pug");

app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  helmet.contentSecurityPolicy({

    directives: {
      "scipt-src": ["'self'", "code.jquery.com", "code.jsdelivr.net"],
    },
  }),
);

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/messages', messageRouter);

app.listen(8080, () => console.log("app listening on port 8080!"));