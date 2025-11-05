import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authroute from "./routes/auth.route.js";
import questroute from './routes/question.route.js';


dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected To MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.listen(3001, () => {
  console.log("Server connected to 3001!!");
});

app.use("/api/auth", authroute);
app.use("/api/question",questroute);

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("access_token");
  return res.status(200).json({ message: "Logged out" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
