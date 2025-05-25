import { Router } from "express";
import dayjs from "dayjs";
import OfficeBook from "../model/officeBook.js";
const router = Router();

// Create a new Entry
router.post("/create-entry", async (req, res) => {
  try {
    const reqBody = req.body;

    const officeIn = JSON.parse(reqBody.officeIn);
    const officeOut = JSON.parse(reqBody.officeOut);

    const validateEntries = (entries) =>
      entries.every(
        (item) =>
          item.amount && item.fullname && item.category && item.modeOfPayment
      );

    if (officeIn && !validateEntries(officeIn)) {
      return res.status(400).json({
        success: false,
        message: "Office In - Validation Failed",
      });
    }

    if (officeOut && !validateEntries(officeOut)) {
      return res.status(400).json({
        success: false,
        message: "Office Out - Validation Failed",
      });
    }

    const entry = await OfficeBook.create({
      officeIn,
      officeOut,
      createDate: reqBody.createDate,
      modeOfPayment: reqBody.modeOfPayment,
    });

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Entry by Date
router.get("/get-entry/:date", async (req, res) => {
  try {
    const createDate = req.params.date;
    const entry = await OfficeBook.findOne({
      createDate,
    });

    if (!entry) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Entry by Date
router.put("/update-entry/:date", async (req, res) => {
  try {
    const createDate = req.params.date;
    const reqBody = req.body;

    const officeIn = JSON.parse(reqBody.officeIn);
    const officeOut = JSON.parse(reqBody.officeOut);

    const validateEntries = (entries) =>
      entries.every((item) => item.amount && item.fullname && item.category && item.modeOfPayment);

    if (officeIn && !validateEntries(officeIn)) {
      return res.status(400).json({
        success: false,
        message: "Office In - Validation Failed",
      });
    }

    if (officeOut && !validateEntries(officeOut)) {
      return res.status(400).json({
        success: false,
        message: "Office Out - Validation Failed",
      });
    }

    const entry = await OfficeBook.findOneAndUpdate(
      { createDate },
      {
        officeIn,
        officeOut,
        modeOfPayment: reqBody.modeOfPayment,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//  Delete Entry by Date
router.delete("/delete-entry/:date", async (req, res) => {
  try {
    const createDate = req.params.date;
    const entry = await OfficeBook.findOneAndDelete({ createDate });

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Entries by Date Range
router.get("/get-entries/:startDate/:endDate", async (req, res) => {
  try {
    const start = dayjs(req.params.startDate, "DD-MM-YYYY");
    const end = dayjs(req.params.endDate, "DD-MM-YYYY");

    const entries = await OfficeBook.find({
      entryCreateDate: {
        $gte: start.startOf("day").toDate(),
        $lte: end.endOf("day").toDate(),
      },
    }).sort({ entryCreateDate: 1 });

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
