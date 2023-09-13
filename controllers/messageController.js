import User from "../models/users.js";
import Message from "../models/messages.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Debug from "debug";
const debug = Debug("messages")

