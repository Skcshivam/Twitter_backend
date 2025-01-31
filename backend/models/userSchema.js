import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    bookMarks: {
      type: Array,
      default: [],
    },
  },
  { Timestamp: true }
);

export const User = mongoose.model("User", userSchema);
