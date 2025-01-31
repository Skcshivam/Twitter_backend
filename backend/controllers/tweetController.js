import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

export const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body;

    // Validate input
    if (!description || !id) {
      return res.status(400).json({
        message: "Description and User ID are required",
        success: false,
      });
    }

    // Create a new tweet
    const user = await User.findById(id).select("-Password");
    await Tweet.create({
      description,
      userID: id,
      userDetails: user,
    });

    // Respond with success
    return res.status(201).json({
      message: "Tweet created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating tweet:", error);

    // Handle server error
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message, // Optional: helpful for debugging in development
    });
  }
};

export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Tweet deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const LikeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const tweet = await Tweet.findByIdAndUpdate(tweetId);

    if (tweet.like.includes(loggedInUserId)) {
      //disklike
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { like: loggedInUserId },
      });
      return res.status(200).json({
        message: "user Disliked your post",
      });
    } else {
      //like
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { like: loggedInUserId },
      });
      return res.status(200).json({
        message: "user liked your post",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const loggedInUserTweets = await Tweet.find({ userID: id });
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUserId) => {
        return Tweet.find({ userID: otherUserId });
      })
    );
    return res.status(200).json({
      tweet: loggedInUserTweets.concat(...followingUserTweet),
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const followingUserTweet = await Promise.all(
      loggedInUser.following.map((otherUserId) => {
        return Tweet.find({ userID: otherUserId });
      })
    );
    return res.status(200).json({
      tweet: [].concat(...followingUserTweet),
    });
  } catch (error) {
    console.log(error);
  }
};
