import mongoose from "mongoose";

const tweetSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userDetails: {
      type: Array,
      default: [],
    },
  },
  { Timestamp: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
