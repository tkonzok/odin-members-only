import mongoose from "mongoose";
import {DateTime} from "luxon";
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: [{ type: Schema.Types.ObjectId, ref: "User" }],
    timestamp: { type: Date, default: Date.now, required: true }
  });

// Virtual for category's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/messages/${this._id}`;
});

MessageSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

MessageSchema.virtual("timestamp_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate();
});

// Export model
export default mongoose.model(
  "Message",
  MessageSchema);
