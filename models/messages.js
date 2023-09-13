import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: [{ type: Schema.Types.ObjectId, ref: "User" }],
    timestamp: { type: String, required: true }
  });

// Virtual for category's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/message/${this._id}`;
});

// Export model
export default mongoose.model(
  "Message",
  MessageSchema);
