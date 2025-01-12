import { Router } from "express";
import RestEntry from "../model/restEntry.js";
const router = Router();

// Create a new Entry
router.post("/create-entry", async (req, res) => {
  try {
    const reqBody = req.body;

    const upad = JSON.parse(reqBody.upad);
    const pending = JSON.parse(reqBody.pending);
    const expenses = JSON.parse(reqBody.expenses);

    const entry = await RestEntry.create({
      upad,
      pending,
      expenses,
      extraAmount: reqBody.extraAmount,
      totalUpad: reqBody.totalUpad,
      totalPending: reqBody.totalPending,
      totalExpenses: reqBody.totalExpenses,
      totalCard: reqBody.totalCard,
      totalPP: reqBody.totalPP,
      totalCash: reqBody.totalCash,
      grandTotal: reqBody.grandTotal,
      date: reqBody.date,
      createDate: reqBody.createDate,
      updatedDateTime: reqBody.updatedDateTime,
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

export default router;
