import { Router } from "express";
import StaffSalary from "../model/staffSalary.js";
import RestStaff from "../model/restStaff.js";
const router = Router();

// Create Salary Sheet
router.post("/create-salary-sheet", async (req, res) => {
  try {

    // Body
    const { month, year, rows, remarks } = req.body;

    // Validate Body
    if (!month || !year || !rows) {
      return res.status(400).json({
        success: false,
        message: "month, year, rows and remarks are required",
      });
    }
    // Skip - Month and Year Validation
    // Validate Rows
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "rows must be a non-empty array",
      });
    }
    // Validate Remarks
    if (typeof remarks !== "string") {
      return res.status(400).json({
        success: false,
        message: "remarks must be a string",
      });
    }

    // Create Salary Sheet
    const salarySheet = await StaffSalary.create({
      month,
      year,
      rows,
      remarks,
    });

    // Return Response
    res.status(200).json({
      success: true,
      data: salarySheet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Salary Sheet by Month and Year
router.get("/get-salary-sheet/:month/:year", async (req, res) => {
  try {
    const month = Number(req.params.month);
    const year = Number(req.params.year);

    const salarySheet = await StaffSalary.findOne({ month, year });

    if (!salarySheet) {
      return res.status(404).json({
        success: false,
        message: "Salary sheet not found for the given month and year",
      });
    }

    res.status(200).json({
      success: true,
      data: salarySheet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Salary Sheet rows by Month and Year
router.put("/update-salary-sheet/:month/:year", async (req, res) => {
  try {
    const month = Number(req.params.month);
    const year = Number(req.params.year);
    const { rows, remarks } = req.body;

    const salarySheet = await StaffSalary.findOneAndUpdate(
      { month, year },
      {
        rows,
        remarks: remarks || "",
        updatedDate: new Date().toLocaleDateString(),
        updatedDateTime: new Date(),
      },
      { new: true },
    );

    if (!salarySheet) {
      return res.status(404).json({
        success: false,
        message: "Salary sheet not found for the given month and year",
      });
    }

    res.status(200).json({
      success: true,
      data: salarySheet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Salary Sheet by Month and Year
router.delete("/delete-salary-sheet/:month/:year", async (req, res) => {
  try {
    const month = Number(req.params.month);
    const year = Number(req.params.year);

    const salarySheet = await StaffSalary.findOneAndDelete({ month, year });

    res.status(200).json({
      success: true,
      data: salarySheet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
