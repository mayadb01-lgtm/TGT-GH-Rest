import { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Autocomplete,
  Button,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import { useDateNavigation } from "../../hooks/useDateNavigation";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

dayjs.locale("en-gb");

const DATE_FORMAT = "DD-MM-YYYY";

const OfficeCreditDebit = () => {
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedProduct, setSelectedProduct] = useState(null); // expenseName string

  const fileNameRef = useRef(null);

  const handleStartDateChange = useCallback((newDate) => {
    if (newDate) setStartDate(newDate);
  }, []);
  const handleEndDateChange = useCallback((newDate) => {
    if (newDate) setEndDate(newDate);
  }, []);

  const { goToPreviousRange, goToNextRange } = useDateNavigation({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  });

  const [rows, setRows] = useState([]);
  const [expenseNameOptions, setExpenseNameOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    creditAmountTotal: 0,
    debitAmountTotal: 0,
    totalBalance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const start = startDate.format(DATE_FORMAT);
        const end = endDate.format(DATE_FORMAT);
        const { data } = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/merge-aggregator/get-credit-debit-entries/${start}/${end}`,

          { params: selectedProduct ? { expenseName: selectedProduct } : {} }
        );
        if (data?.success) {
          setRows(data.data.finalRows || []);
          setExpenseNameOptions(data.data.expenseNameOptions || []);
          setTotals({
            creditAmountTotal: data.data.creditAmountTotal || 0,
            debitAmountTotal: data.data.debitAmountTotal || 0,
            totalBalance: data.data.totalBalance || 0,
          });
        } else {
          setError(data?.message || "Could not load entries.");
          setRows([]);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || "Could not load entries.";
        setError(message);
        toast.error(message);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, selectedProduct]);

  const columns = [
    {
      field: "createDate",
      headerName: "Date",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullname",
      headerName: "Name",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "expenseName",
      headerName: "Expense",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "source",
      headerName: "Source",
      width: 130,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) =>
        ({
          restAapvana: "Restaurant Credit",
          restExpense: "Restaurant Expense",
          officeIn: "Office In",
          officeOut: "Office Out",
        })[value] ||
        value ||
        "",
    },
    {
      field: "modeOfPayment",
      headerName: "Mode of Payment",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "credit",
      headerName: "Amount In",
      width: 130,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => (value ? value.toLocaleString("en-IN") : ""),
    },
    {
      field: "debit",
      headerName: "Amount Out",
      width: 130,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => (value ? value.toLocaleString("en-IN") : ""),
    },
    {
      field: "balance",
      headerName: "Balance",
      width: 130,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) =>
        typeof value === "number" ? value.toLocaleString("en-IN") : "",
    },
  ];

  const headerMap = {
    createDate: "Date",
    fullname: "Name",
    expenseName: "Product / Category",
    source: "Source",
    modeOfPayment: "Mode of Payment",
    credit: "Amount In",
    debit: "Amount Out",
    balance: "Balance",
  };

  const handleExportToExcel = () => {
    const exportRows = rows.filter((row) => row.id !== "Total");
    if (exportRows.length === 0) {
      toast.error("No data available to export for selected date range.");
      return;
    }
    const headingText = fileNameRef.current?.innerText || "";
    let prefix = "Export";
    if (headingText.includes("Guest House")) prefix = "GH";
    else if (headingText.includes("Restaurant")) prefix = "R";
    else if (headingText.includes("Office")) prefix = "OB";

    const fileName = `${prefix} Aapvana Levana Balance - ${startDate.format(
      DATE_FORMAT
    )} to ${endDate.format(DATE_FORMAT)}.xlsx`;

    const exportData = exportRows.map((item) => {
      const transformed = {};
      Object.keys(headerMap).forEach((key) => {
        transformed[headerMap[key]] = item[key];
      });
      return transformed;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aapvana Levana");
    XLSX.writeFile(workbook, fileName);
  };

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
      <Box sx={{ alignItems: "center", py: 3 }}>
        <Typography
          ref={fileNameRef}
          variant="h5"
          fontWeight={600}
          color="text.primary"
        >
          Office Credit Debit
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
      >
        <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
          Select Date Range
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            value={startDate}
            onChange={handleStartDateChange}
            format={DATE_FORMAT}
            slotProps={{ textField: { size: "small" } }}
            views={["year", "month", "day"]}
          />
          <Typography>-</Typography>
          <DatePicker
            value={endDate}
            onChange={handleEndDateChange}
            format={DATE_FORMAT}
            slotProps={{ textField: { size: "small" } }}
            views={["year", "month", "day"]}
          />
        </LocalizationProvider>

        <Box
          display="flex"
          alignItems="center"
          gap={2}
          justifyContent="center"
          border={1}
          borderColor="divider"
          borderRadius={2}
          p={1}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Month
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={goToPreviousRange}
              sx={{ minWidth: "40px", padding: "4px" }}
            >
              <SkipPreviousRoundedIcon fontSize="small" />
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={goToNextRange}
              sx={{ minWidth: "40px", padding: "4px" }}
            >
              <SkipNextRoundedIcon fontSize="small" />
            </Button>
          </Stack>
        </Box>

        <Autocomplete
          disablePortal
          id="expenseName"
          options={expenseNameOptions}
          value={selectedProduct}
          style={{ width: 260 }}
          renderInput={(params) => (
            <TextField {...params} label="Product / Category" />
          )}
          onChange={(event, newValue) => setSelectedProduct(newValue)}
          size="small"
        />

        <Button
          variant="outlined"
          color="primary"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ width: "100%", maxWidth: 1100, mt: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 3, width: "100%", maxWidth: 1100 }}
      >
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Total Credit
            </Typography>
            <Typography variant="h6" color="success.main">
              {totals.creditAmountTotal.toLocaleString("en-IN")}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Total Debit
            </Typography>
            <Typography variant="h6" color="error.main">
              {totals.debitAmountTotal.toLocaleString("en-IN")}
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Balance
            </Typography>
            <Typography variant="h6">
              {totals.totalBalance.toLocaleString("en-IN")}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ width: "100%", maxWidth: 1100, mt: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          showCellVerticalBorder
          showColumnVerticalBorder
          getRowClassName={(params) =>
            params.row.id === "Total" ? "total-row" : ""
          }
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[25, 50, 100]}
          sx={{
            "& .total-row": {
              fontWeight: 700,
              backgroundColor: "action.hover",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default OfficeCreditDebit;
