import { Router } from "express";
import dayjs from "dayjs";
import RestEntry from "../model/restEntry.js";
import OfficeBook from "../model/officeBook.js";

const router = Router();
const DATE_FORMAT = "DD-MM-YYYY";

/**
 * Credit sources: Restaurant "Aapvana Baki" (pendingUsers) + Office In
 * Debit sources:  Restaurant Expenses (expenses)           + Office Out
 *
 * Optional query param `expenseName` filters the report down to a single
 * product/category (for the dropdown-driven single-product view) and
 * recomputes the running balance + totals for just that subset.
 */
router.get(
  "/get-credit-debit-entries/:startDate/:endDate",
  async (req, res) => {
    try {
      const start = dayjs(req.params.startDate, DATE_FORMAT, true);
      const end = dayjs(req.params.endDate, DATE_FORMAT, true);

      if (!start.isValid() || !end.isValid()) {
        return res.status(400).json({
          success: false,
          message: `Invalid date(s). Expected format ${DATE_FORMAT}.`,
        });
      }

      const expenseName = req.query.expenseName?.trim() || null;

      const dateRange = {
        entryCreateDate: {
          $gte: start.startOf("day").toDate(),
          $lte: end.endOf("day").toDate(),
        },
      };

      // Fetch both sources in parallel instead of sequentially.
      const [restEntries, officeBooks] = await Promise.all([
        RestEntry.find(dateRange, { pendingUsers: 1, expenses: 1 })
          .sort({ entryCreateDate: 1 })
          .lean(),
        OfficeBook.find(dateRange, { officeIn: 1, officeOut: 1 })
          .sort({ entryCreateDate: 1 })
          .lean(),
      ]);

      const restAapvanaEntries = restEntries.flatMap(
        (e) => e.pendingUsers || []
      );
      const restExpensesEntries = restEntries.flatMap((e) => e.expenses || []);
      const officeInEntries = officeBooks.flatMap((e) => e.officeIn || []);
      const officeOutEntries = officeBooks.flatMap((e) => e.officeOut || []);

      // Unique Return Schema
      // Columns: id, date, fullname, expenseName, modeOfPayment, credit, debit, balance, source
      const buildRow = (entry, { isCredit, defaultMode, source }) => ({
        // NOTE: with .lean() docs are plain objects, so the Mongoose virtual
        // `.id` getter no longer exists — use `_id` directly instead.
        id: entry._id?.toString?.() || entry.id,
        createDate: entry.createDate,
        entryCreateDate: entry.entryCreateDate,
        fullname: entry.fullname || entry.expenseName || "",
        expenseName: entry.expenseName || entry.categoryName || null,
        modeOfPayment: entry.modeOfPayment || defaultMode,
        credit: isCredit ? entry.amount || 0 : 0,
        debit: isCredit ? 0 : entry.amount || 0,
        source,
      });

      const finalRows = [
        ...restAapvanaEntries.map((e) =>
          buildRow(e, {
            isCredit: true,
            defaultMode: "Rest",
            source: "restAapvana",
          })
        ),
        ...restExpensesEntries.map((e) =>
          buildRow(e, {
            isCredit: false,
            defaultMode: "UnPaid",
            source: "restExpense",
          })
        ),
        ...officeInEntries.map((e) =>
          buildRow(e, {
            isCredit: true,
            defaultMode: "UnPaid",
            source: "officeIn",
          })
        ),
        ...officeOutEntries.map((e) =>
          buildRow(e, {
            isCredit: false,
            defaultMode: "UnPaid",
            source: "officeOut",
          })
        ),
      ];

      // Sort by the actual entryCreateDate (real Date value), falling back
      // to parsing createDate with an explicit format if it's ever missing.
      finalRows.sort((a, b) => {
        const aTime = a.entryCreateDate
          ? new Date(a.entryCreateDate).getTime()
          : dayjs(a.createDate, DATE_FORMAT).valueOf();
        const bTime = b.entryCreateDate
          ? new Date(b.entryCreateDate).getTime()
          : dayjs(b.createDate, DATE_FORMAT).valueOf();
        return aTime - bTime;
      });

      // Distinct list of product/expense names, for the dropdown that lets
      // the user drill into a single product's credit/debit/balance.
      const expenseNameOptions = [
        ...new Set(finalRows.map((r) => r.expenseName).filter(Boolean)),
      ].sort();

      // If a specific product/expenseName was requested, narrow the rows
      // down before computing the running balance, so the balance reflects
      // just that product's movement.
      const rows = expenseName
        ? finalRows.filter((r) => r.expenseName === expenseName)
        : finalRows;

      let runningBalance = 0;
      rows.forEach((entry) => {
        runningBalance += entry.credit - entry.debit;
        entry.balance = runningBalance;
      });

      const creditAmountTotal = rows.reduce(
        (sum, entry) => sum + entry.credit,
        0
      );
      const debitAmountTotal = rows.reduce(
        (sum, entry) => sum + entry.debit,
        0
      );
      const totalBalance = creditAmountTotal - debitAmountTotal;

      rows.push({
        id: "Total",
        createDate: "",
        entryCreateDate: null,
        fullname: "",
        expenseName: null,
        modeOfPayment: "",
        credit: creditAmountTotal,
        debit: debitAmountTotal,
        balance: totalBalance,
      });

      return res.status(200).json({
        success: true,
        data: {
          finalRows: rows,
          expenseNameOptions,
          creditAmountTotal,
          debitAmountTotal,
          totalBalance,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

export default router;
