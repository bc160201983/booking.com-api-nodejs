import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());

app.use(cookieParser());

const connect = async () => {
  try {
    await mongoose.connect(process.env.mongodb);
    console.log("connected to mongodb");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!!");
});

//middleware
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const erroStatus = err.status || 500;
  const erroMsg = err.message || "Someting went wrong!";
  return res.status(erroStatus).json({
    success: false,
    status: erroStatus,
    message: erroMsg,
    stack: err.stack,
  });
});

app.listen(8000, () => {
  connect();
  console.log("connected to backend!");
});
