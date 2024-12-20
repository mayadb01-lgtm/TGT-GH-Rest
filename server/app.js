import express from "express";
import process from "process";
const app = express();
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173", "https://guesthouse-seven.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.get("/test", (req, res) => {
  res.send("Hello World!");
});
app.use(bodyParser.urlencoded({ extended: true }));

// Environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "./.env" });
}

// Import routes
import user from "./controller/user.js";
import admin from "./controller/admin.js";
import entry from "./controller/entry.js";

// Use routes
app.use("/api/v1/user", user);
app.use("/api/v1/admin", admin);
app.use("/api/v1/entry", entry);

export default app;