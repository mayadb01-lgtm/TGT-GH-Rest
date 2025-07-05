import process from "process";
import app from "./app.js";
import connectDatabase from "./db/Database.js";
import dotenv from "dotenv";
import runBackup from "./utils/runBackup.js";

// Models
import User from "./model/user.js";
import Admin from "./model/admin.js";
import Room from "./model/room.js";
import Entry from "./model/entry.js";
import RestEntry from "./model/restEntry.js";
import RestStaff from "./model/restStaff.js";
import RestPending from "./model/restPending.js";
import OfficeBook, { OfficeCategory } from "./model/officeBook.js";

const backupModels = [
  User,
  Admin,
  Room,
  Entry,
  RestEntry,
  RestStaff,
  RestPending,
  OfficeBook,
  OfficeCategory,
];

// Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "./.env" });
}

// DB Connection
connectDatabase();

// Server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 8080}`
  );
});

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/send-backup", async (req, res) => {
  try {
    await runBackup(backupModels);
    res.status(200).json({
      success: true,
      message: "Backup created and stored as backup.zip",
    });
  } catch (error) {
    console.error("❌ Backup failed:", error);
    res.status(500).json({
      success: false,
      message: "Backup failed",
      error: error.message,
    });
  }
});

// Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(
    `shutting down the server for handling unhandled promise rejection`
  );
  server.close(() => {
    process.exit(1);
  });
});
