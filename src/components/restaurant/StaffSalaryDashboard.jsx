import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";

dayjs.locale("en-gb");

const columns = [
  {
    field: "index",
    headerName: "No",
    width: 80,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <>{params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}</>
    ),
  },
  {
    field: "fullname",
    headerName: "Staff Name",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "perDayPay",
    headerName: "Per Day Pay",
    width: 120,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      `${Number(params.value || 0).toLocaleString("en-IN")}`
  },
  {
    field: "attendance",
    headerName: "Attendance",
    width: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "total",
    headerName: "Total",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      `${Number(params.value || 0).toLocaleString("en-IN")}`
  },
  {
    field: "restaurantUpaad",
    headerName: "Rest. Upaad",
    width: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      `${Number(params.value || 0).toLocaleString("en-IN")}`
  },
  {
    field: "officeUpaad",
    headerName: "Office Upaad",
    width: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      `${Number(params.value || 0).toLocaleString("en-IN")}`
  },
  {
    field: "currentBalance",
    headerName: "Balance",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      `${Number(params.value || 0).toLocaleString("en-IN")}`
  },
];

const StaffSalaryDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [salarySheet, setSalarySheet] = useState(null);
  const [loading, setLoading] = useState(false);

  const month = selectedMonth.month() + 1;
  const year = selectedMonth.year();

  useEffect(() => {
    handleLoad();
  }, [month, year]);

  const handleLoad = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/staffSalary/get-salary-sheet/${month}/${year}`,
      );
      setSalarySheet(data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
        error?.message ??
        "An unknown error occurred.",
      );
      setSalarySheet(null);
    } finally {
      setLoading(false);
    }
  };

  const rows =
    salarySheet?.rows?.map((row) => ({
      ...row,
      id: row._id,
    })) || [];

  const summary = rows.reduce(
    (acc, row) => {
      acc.totalSalary += row.total || 0;
      acc.totalRestUpaad += row.restaurantUpaad || 0;
      acc.totalOfficeUpaad += row.officeUpaad || 0;
      acc.totalBalance += row.currentBalance || 0;
      return acc;
    },
    {
      totalSalary: 0,
      totalRestUpaad: 0,
      totalOfficeUpaad: 0,
      totalBalance: 0,
    },
  );

  return (
    <Box
      sx={{
        py: 2,
        px: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box sx={{ alignItems: "center", py: 3 }}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Staff Salary Dashboard
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        mb={2}
        flexWrap="wrap"
      >
        <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
          Select Month:
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            views={["year", "month"]}
            value={selectedMonth}
            onChange={(newDate) => {
              if (newDate) setSelectedMonth(newDate);
            }}
            format="MMMM YYYY"
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        sx={{ mb: 2 }}
      >
        <Box
          sx={{
            p: 2,
            minWidth: 180,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">
            Total Salary
          </Typography>
          <Typography variant="h6">
            {summary.totalSalary.toLocaleString("en-IN")}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            minWidth: 180,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">
            Restaurant Upaad
          </Typography>
          <Typography variant="h6">
            {summary.totalRestUpaad.toLocaleString("en-IN")}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            minWidth: 180,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">
            Office Upaad
          </Typography>
          <Typography variant="h6">
            {summary.totalOfficeUpaad.toLocaleString("en-IN")}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            minWidth: 180,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">
            Net Balance
          </Typography>
          <Typography variant="h6">
            {summary.totalBalance.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Stack>

      {salarySheet ? (
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns}
          hideFooter
          WebkitFontSmoothing="auto"
          letterSpacing="normal"
          sx={{
            mt: 2,
            width: "100%",
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
            "& .MuiDataGrid-cell:hover": { color: "primary.main" },
            "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
              border: "1px solid #f0f0f0",
            },
          }}
        />
      ) : (
        <Typography variant="subtitle1" color="text.secondary" mt={2}>
          No salary sheet found for {selectedMonth.format("MMMM YYYY")}
        </Typography>
      )}
    </Box>
  );
};

export default StaffSalaryDashboard;
