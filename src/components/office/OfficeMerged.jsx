import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getEntriesByDateRange } from "../../redux/actions/entryAction";
import dayjs from "dayjs";
// import toast from "react-hot-toast";
// import * as XLSX from "xlsx";
import { getRestEntriesByDateRange } from "../../redux/actions/restEntryAction";
import { getOfficeBookByDateRange } from "../../redux/actions/officeBookAction";

dayjs.locale("en-gb");

// Utility: Format date

const OfficeMerged = () => {
  const dispatch = useAppDispatch();
  const { loading: ghLoading, entries } = useAppSelector(
    (state) => state.entry
  );
  const { loading: restLoading, restEntries } = useAppSelector(
    (state) => state.restEntry
  );
  const { loading: officeLoading, officeBook } = useAppSelector(
    (state) => state.officeBook
  );

  const formatDate = (date) =>
    dayjs(date, ["DD-MM-YYYY", "YYYY-MM-DD", "MM-DD-YYYY"]).format(
      "DD-MM-YYYY"
    );

  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs());

  const handleStartDateChange = useCallback((newDate) => {
    if (newDate) setStartDate(newDate);
  }, []);

  const handleEndDateChange = useCallback((newDate) => {
    if (newDate) setEndDate(newDate);
  }, []);

  useEffect(() => {
    dispatch(
      getEntriesByDateRange(
        startDate.format("DD-MM-YYYY"),
        endDate.format("DD-MM-YYYY")
      )
    );
    dispatch(
      getRestEntriesByDateRange(
        startDate.format("DD-MM-YYYY"),
        endDate.format("DD-MM-YYYY")
      )
    );
    dispatch(
      getOfficeBookByDateRange(
        startDate.format("DD-MM-YYYY"),
        endDate.format("DD-MM-YYYY")
      )
    );
  }, [dispatch, startDate, endDate]);

  const columns = [
    { field: "id", headerName: "Index", width: 100 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "ghCashIn", headerName: "GH Cash In", width: 100 },
    { field: "restCashIn", headerName: "Rest Cash In", width: 100 },
    { field: "restCashOut", headerName: "Rest Cash Out", width: 100 },
    { field: "officeCashIn", headerName: "Office Cash In", width: 100 },
    { field: "officeCashOut", headerName: "Office Cash Out", width: 100 },
    { field: "cash", headerName: "Cash", width: 100 },
    { field: "ghCardIn", headerName: "GH Card In", width: 100 },
    { field: "restCardIn", headerName: "Rest Card In", width: 100 },
    { field: "officeCardIn", headerName: "Office Card In", width: 100 },
    { field: "officeCardOut", headerName: "Office Card Out", width: 100 },
    { field: "card", headerName: "Card", width: 100 },
    { field: "restPPIn", headerName: "Rest PP In", width: 100 },
    { field: "officePPIn", headerName: "Office PP In", width: 100 },
    { field: "officePPOut", headerName: "Office PP Out", width: 100 },
    { field: "pp", headerName: "PP", width: 100 },
    { field: "ghPPCIn", headerName: "GH PPC In", width: 100 },
    { field: "officePPCIn", headerName: "Office PPC In", width: 100 },
    { field: "officePPCOut", headerName: "Office PPC Out", width: 100 },
    { field: "ppc", headerName: "PPC", width: 100 },
    { field: "ghPPSIn", headerName: "GH PPS In", width: 100 },
    { field: "officePPSIn", headerName: "Office PPS In", width: 100 },
    { field: "officePPSOut", headerName: "Office PPS Out", width: 100 },
    { field: "pps", headerName: "PPS", width: 100 },
    { field: "total", headerName: "Total", width: 100 },
  ];

  // Get all unique dates from all sources
  const uniqueDates = useMemo(() => {
    const ghDates = entries?.map((entry) => formatDate(entry.date)) || [];
    const restDates =
      restEntries?.map((entry) => formatDate(entry.createDate)) || [];
    const officeDates =
      officeBook?.map((entry) => formatDate(entry.createDate)) || [];

    return [...new Set([...ghDates, ...restDates, ...officeDates])].sort(
      (a, b) =>
        dayjs(a, "DD-MM-YYYY").isAfter(dayjs(b, "DD-MM-YYYY")) ? 1 : -1
    );
  }, [entries, restEntries, officeBook]);

  console.log("uniqueDates", uniqueDates);

  const preparedRows = useMemo(() => {
    return uniqueDates.map((dateStr, idx) => {
      // TODO:CASH
      // GH Cash
      const ghCashIn =
        entries
          ?.filter((entry) => formatDate(entry.date) === dateStr)
          ?.flatMap((entry) =>
            entry.entry?.filter(
              (item) => item.isPaid && item.modeOfPayment === "Cash"
            )
          )
          ?.reduce((sum, item) => sum + item.rate, 0) || 0;

      // Rest Cash
      const restCashIn =
        restEntries
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.reduce((sum, entry) => sum + (entry.totalCash || 0), 0) || 0;

      // Rest Expense Cash
      const restCashOut =
        restEntries
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.expenses || [])
          ?.reduce((sum, item) => sum + item.amount, 0) || 0;

      // Office In
      const officeCashIn =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeIn || [])
          ?.reduce(
            (sum, item) =>
              sum + (item.modeOfPayment === "Cash" ? item.amount : 0),
            0
          ) || 0;

      // Office Out
      const officeCashOut =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeOut || [])
          ?.reduce(
            (sum, item) =>
              sum + (item.modeOfPayment === "Cash" ? item.amount : 0),
            0
          ) || 0;

      const cash =
        ghCashIn + restCashIn + officeCashIn - restCashOut - officeCashOut;

      // TODO:CARD
      const ghCardIn =
        entries
          ?.filter((entry) => formatDate(entry.date) === dateStr)
          ?.flatMap((entry) =>
            entry.entry?.filter(
              (item) => item.isPaid && item.modeOfPayment === "Card"
            )
          )
          ?.reduce((sum, item) => sum + item.rate, 0) || 0;

      const restCardIn =
        restEntries
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.reduce((sum, entry) => sum + (entry.totalCard || 0), 0) || 0;

      const OfficeCardIn =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeIn || [])
          ?.reduce(
            (sum, item) =>
              sum + (item.modeOfPayment === "Card" ? item.amount : 0),
            0
          ) || 0;

      const OfficeCardOut =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeOut || [])
          ?.reduce(
            (sum, item) =>
              sum + (item.modeOfPayment === "Card" ? item.amount : 0),
            0
          ) || 0;

      const card = ghCardIn + restCardIn + OfficeCardIn - OfficeCardOut;

      // TODO: PP
      const restPPIn =
        restEntries
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.reduce((sum, entry) => sum + (entry.totalPP || 0), 0) || 0;

      const OfficePPIn =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeIn || [])
          ?.reduce(
            (sum, item) =>
              sum + (item.modeOfPayment === "PP" ? item.amount : 0),
            0
          ) || 0;

      const OfficePPOut =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeOut || [])
          ?.reduce(
            (sum, item) =>
              sum + (item.modeOfPayment === "PP" ? item.amount : 0),
            0
          ) || 0;

      const pp = restPPIn + OfficePPIn - OfficePPOut;

      // TODO: PPC
      const ghPPCIn =
        entries
          ?.filter((entry) => formatDate(entry.date) === dateStr)
          ?.flatMap((entry) =>
            entry.entry?.filter(
              (item) => item.isPaid && item.modeOfPayment === "PPC"
            )
          )
          ?.reduce((sum, item) => sum + item.rate, 0) || 0;

      const officePPCIn =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeIn || [])
          ?.reduce(
            (sum, item) =>
              sum + (item.modeOfPayment === "PPC" ? item.amount : 0),
            0
          ) || 0;

      const officePPCOut =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeOut || [])
          ?.reduce(
            (sum, item) =>
              sum + (item.modeOfPayment === "PPC" ? item.amount : 0),
            0
          ) || 0;

      const ppc = ghPPCIn + officePPCIn - officePPCOut;

      // TODO: PPS
      const ghPPSIn =
        entries
          ?.filter((entry) => formatDate(entry.date) === dateStr)
          ?.flatMap((entry) =>
            entry.entry?.filter(
              (item) => item.isPaid && item.modeOfPayment === "PPS"
            )
          )
          ?.reduce((sum, item) => sum + item.rate, 0) || 0;

      const officePPSIn =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeIn || [])
          ?.reduce(
            (sum, item) => sum + (item.modeOfPayment === "PPS" ? item.amount : 0),
            0
          ) || 0;

      const officePPSOut =
        officeBook
          ?.filter((entry) => formatDate(entry.createDate) === dateStr)
          ?.flatMap((entry) => entry.officeOut || [])
          ?.reduce(
            (sum, item) => sum + (item.modeOfPayment === "PPS" ? item.amount : 0),
            0
          ) || 0;

      const pps = ghPPSIn + officePPSIn - officePPSOut;

      const total = cash + card + pp + ppc + pps;

      return {
        id: idx + 1,
        date: dateStr,
        ghCashIn,
        restCashIn,
        restCashOut,
        officeCashIn,
        officeCashOut,
        cash,
        ghCardIn,
        restCardIn,
        OfficeCardIn,
        OfficeCardOut,
        card: card,
        restPPIn,
        OfficePPIn,
        OfficePPOut,
        pp: pp,
        ghPPCIn,
        officePPCIn,
        officePPCOut,
        ppc: ppc,
        ghPPSIn,
        officePPSIn,
        officePPSOut,
        pps: pps,
        total: total,
      };
    });
  }, [uniqueDates, entries, restEntries, officeBook]);

  return (
    <Box
      sx={{
        py: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          py: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Guest House Sales Dashboard
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
          Select Date Range
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            value={startDate}
            onChange={handleStartDateChange}
            format="DD-MM-YYYY"
            renderInput={(params) => <TextField {...params} size="small" />}
            views={["year", "month", "day"]}
          />
          <Typography>-</Typography>
          <DatePicker
            value={endDate}
            onChange={handleEndDateChange}
            format="DD-MM-YYYY"
            renderInput={(params) => <TextField {...params} size="small" />}
            views={["year", "month", "day"]}
          />
        </LocalizationProvider>
        {/* <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button> */}
      </Stack>
      {ghLoading && restLoading && officeLoading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : (
        <DataGrid
          rows={preparedRows}
          columns={columns}
          pageSize={5}
          sx={{
            mt: 2,
            height: 400,
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
          }}
        />
      )}
    </Box>
  );
};

export default OfficeMerged;
