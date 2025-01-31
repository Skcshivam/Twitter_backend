import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
};

export default databaseConnection;
