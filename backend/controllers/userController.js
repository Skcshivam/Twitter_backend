import { User } from "../models/userSchema.js";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { Name, Username, Email, Password } = req.body;
    //basic validation
    if (!Name || !Username || !Email || !Password) {
      return res.status(401).json({
        message: "All Feild are required",
        success: false,
      });
    }

    const user = await User.findOne({ Email });
    if (user) {
      return res.status(401).json({
        message: "User already Exist",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(Password, 16);

    await User.create({
      Name,
      Username,
      Email,
      Password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created sucessfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(401).json({
        message: "All Feild are required",
        success: false,
      });
    }
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({
        message: "User dosn't exist with this email",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._Id,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({
        message: `welcome back ${user.Name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = (req, res) => {
  return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
    message: "User Logged out successfully",
    success: true,
  });
};

//in this code there is something issue so i fix with the help of chatgpt
export const bookMark = async (req, res) => {
  try {
    const loggedInUserId = req.body.id; // Ensure `id` exists in the request body
    const tweetId = req.params.id; // Ensure `id` exists in the request parameters

    if (!loggedInUserId || !tweetId) {
      return res.status(400).json({
        message: "User ID and Tweet ID are required.",
        success: false,
      });
    }

    const user = await User.findById(loggedInUserId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (user.bookMarks.includes(tweetId)) {
      // Remove bookmark
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { bookMarks: tweetId },
      });
      return res.status(200).json({
        message: "Removed from bookmark",
        success: true,
      });
    } else {
      // Add bookmark
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { bookMarks: tweetId },
      });
      return res.status(200).json({
        message: "Saved to bookmark",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error in bookMark:", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      success: false,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-Password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const otherUsers = await User.find({ _id: { $ne: id } }).select(
      "-Password"
    ); //$ne = not equal
    if (!otherUsers) {
      return res.status(401).json({
        message: "Currently do not have any users ",
      });
    }
    return res.status(200).json({
      otherUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId); //shivam
    const user = await User.findById(userId); // shubham

    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User already follow to ${user.Name}`,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.Name} just follows to ${user.Name}`,
      success: true,
    });
  } catch (error) {}
};

export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId); //shivam
    const user = await User.findById(userId); // shubham

    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `user not followed yet`,
      });
    }
    return res.status(200).json({
      message: `${loggedInUser.Name} unfollows to ${user.Name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
