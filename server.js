import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./config/dbConn.js";
import blogRouter from './routes/blog.js';
import userRouter from './routes/auth.js'; 


config(); 
const app = express();
const PORT = process.env.PORT || 5500;
//connect to mongodb
connectDB();

app.use(cors());
app.use(express.urlencoded({ extended: false }));

//to parse json
app.use(express.json());
app.use("/images", express.static("./images"));


// routes --
// app.use("/", "hello");
app.use("/auth",userRouter);
app.use("/blog",blogRouter);


mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});