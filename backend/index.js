import express from "express";
import { connectDB } from "./db/connectDB.js";
import dotEnv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotEnv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); //allows us to parse incoming requests: req.body;
app.use(cookieParser()); //allows us to parse incoming cookies

app.use("/api/auth", authRoutes);

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log(`JSwebtoken: ${process.env.JWT_SECRET}`);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
