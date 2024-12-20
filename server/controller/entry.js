import { Router } from "express";
import Entry from "../model/entry.js";
// import { isAuthenticated } from "../middleware/auth.js";
const router = Router();

// Create a new Entry
router.post("/create-entry", async (req, res) => {
  try {
    const { entries, date } = req.body;
    let parsedEntries = entries;

    // Parse entries from JSON string to JavaScript object
    if (typeof entries === "string") {
      parsedEntries = JSON.parse(entries);
    }
    console.log("entries", parsedEntries);

    // Validate request body
    if (
      !parsedEntries ||
      !Array.isArray(parsedEntries) ||
      parsedEntries.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Entries must be a non-empty array.",
      });
    }
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required.",
      });
    }

    const requiredFields = [
      "id",
      "roomNo",
      "cost",
      "rate",
      "noOfPeople",
      "type",
      "modeOfPayment",
      "checkInTime",
      "checkOutTime",
      "date",
    ];

    // Validate each entry in the array
    for (const entry of parsedEntries) {
      for (const field of requiredFields) {
        if (!entry[field]) {
          return res.status(400).json({
            success: false,
            message: `Missing field: ${field}`,
          });
        }
      }
    }

    // Create a new Entry document
    const newEntry = new Entry({
      entry: parsedEntries,
      date,
      // user: req.user._id, // Assign the authenticated user's ID
    });

    // Save the Entry to the database
    const createdEntry = await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Entry created successfully.",
      data: createdEntry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
