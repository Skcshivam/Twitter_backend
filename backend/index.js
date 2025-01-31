import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

dotenv.config();
databaseConnection();

const app = express();

//middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:3000", // For local development
    "https://dazzling-dango-083159.netlify.app", // Your Netlify frontend URL
  ],
  credentials: true, // Allow credentials (cookies, authorization headers)
  extended: true,
};
app.use(cors(corsOptions));

//api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// app.get("/home", (req, res) => {
//   res.status(200).json({
//     message: "fetch from backend",
//   });
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
