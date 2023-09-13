import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
  });

// Virtual for category's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/user/${this._id}`;
});

// Export model
export default mongoose.model(
  "User",
  UserSchema);
