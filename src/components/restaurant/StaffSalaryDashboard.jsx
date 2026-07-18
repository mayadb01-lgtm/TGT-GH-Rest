import { useState, useEffect } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getOfficeBookCategoryUpaadByMonthRange } from "../../redux/actions/officeBookAction";
import { getSalarySheetsByMonthRange } from "../../redux/actions/staffSalaryAction";
import { getStaffUpaadByMonthRange } from "../../redux/actions/restEntryAction";

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
    field: "month",
    headerName: "Month",
    width: 150,
    headerAlign: "center",
    align: "center",
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
      `${Number(params.value || 0).toLocaleString("en-IN")}`,
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
      `${Number(params.value || 0).toLocaleString("en-IN")}`,
  },
  {
    field: "restaurantUpaad",
    headerName: "Rest. Upaad",
    width: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      `${Number(params.value || 0).toLocaleString("en-IN")}`,
  },
  {
    field: "officeUpaad",
    headerName: "Office Upaad",
    width: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      `${Number(params.value || 0).toLocaleString("en-IN")}`,
  },
  {
    field: "currentBalance",
    headerName: "Balance",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) =>
      `${Number(params.value || 0).toLocaleString("en-IN")}`,
  },
  {
    field: "salaryPaid",
    headerName: "Salary Paid?",
    width: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <Chip
        label={params.value ? "Paid" : "Unpaid"}
        color={params.value ? "success" : "default"}
        size="small"
        variant={params.value ? "filled" : "outlined"}
      />
    ),
  },
];

const StaffSalaryDashboard = () => {
  const dispatch = useAppDispatch();
  const { loading: staffUpaadLoading, staffTotalUpaad } = useAppSelector(
    (state) => state.restEntry,
  );
  const { loading: officeUpaadLoading, officeBookCategoryUpaad } =
    useAppSelector((state) => state.officeBook);
  const { loading: salaryLoading, salarySheets } = useAppSelector(
    (state) => state.staffSalary,
  );
  const [startMonth, setStartMonth] = useState(dayjs());
  const [endMonth, setEndMonth] = useState(dayjs());
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    const startDate = startMonth.startOf("month").format("DD-MM-YYYY");
    const endDate = endMonth.endOf("month").format("DD-MM-YYYY");
    dispatch(getStaffUpaadByMonthRange(startDate, endDate));
    dispatch(getOfficeBookCategoryUpaadByMonthRange(startDate, endDate));
    dispatch(getSalarySheetsByMonthRange(startDate, endDate));
  }, [dispatch, startMonth, endMonth]);

  const allRows = (salarySheets || []).flatMap((sheet) => {
    // Build the same "YYYY-MM" key both backends group by
    const monthKey = `${sheet.year}-${String(sheet.month).padStart(2, "0")}`;
    const staffMonthBucket = staffTotalUpaad?.[monthKey] || {};
    const officeMonthBucket = officeBookCategoryUpaad?.[monthKey] || {};

    return (sheet.rows || []).map((row) => {
      const restaurantUpaad = staffMonthBucket[row.staffId?.toString()] || 0;
      const officeUpaad = officeMonthBucket[row.staffId?.toString()] || 0;
      const total = Number(row.perDayPay || 0) * Number(row.attendance || 0);

      return {
        ...row,
        id: `${sheet._id}-${row._id}`,
        month: `${dayjs()
          .month(sheet.month - 1)
          .format("MMMM")} ${sheet.year}`,
        // numeric key purely for sorting months ascending; not for display
        monthSortKey: sheet.year * 12 + sheet.month,
        total,
        restaurantUpaad,
        officeUpaad,
        currentBalance: total - restaurantUpaad - officeUpaad,
        salaryPaid: Boolean(row.salaryPaid),
      };
    });
  });

  // Group rows by staff (fullname), then sort months ascending inside each group,
  // and keep each staff's rows contiguous in the final list.
  const sortedRows = [...allRows].sort((a, b) => {
    const nameCompare = (a.fullname || "").localeCompare(b.fullname || "");
    if (nameCompare !== 0) return nameCompare;
    return a.monthSortKey - b.monthSortKey;
  });

  const nameOptions = [
    ...new Set(sortedRows.map((row) => row.fullname)),
  ].filter(Boolean);

  const rows = selectedName
    ? sortedRows.filter((row) => row.fullname === selectedName)
    : sortedRows;

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
          Select Month Range:
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            views={["year", "month"]}
            value={startMonth}
            onChange={(newDate) => {
              if (newDate) setStartMonth(newDate);
            }}
            format="MMMM YYYY"
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            views={["year", "month"]}
            value={endMonth}
            onChange={(newDate) => {
              if (newDate) setEndMonth(newDate);
            }}
            format="MMMM YYYY"
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>

        <Autocomplete
          options={nameOptions}
          value={selectedName}
          onChange={(event, newValue) => setSelectedName(newValue)}
          sx={{ minWidth: 220 }}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Name" size="small" />
          )}
        />
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 2,
            minWidth: 180,
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2">Total Salary</Typography>
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
          <Typography variant="body2">Restaurant Upaad</Typography>
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
          <Typography variant="body2">Office Upaad</Typography>
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
          <Typography variant="body2">Net Balance</Typography>
          <Typography variant="h6">
            {summary.totalBalance.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Stack>

      {rows.length > 0 ? (
        <DataGrid
          loading={staffUpaadLoading || officeUpaadLoading || salaryLoading}
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
          No salary sheet found for {startMonth.format("MMMM YYYY")} to{" "}
          {endMonth.format("MMMM YYYY")}
        </Typography>
      )}
    </Box>
  );
};

export default StaffSalaryDashboard;
