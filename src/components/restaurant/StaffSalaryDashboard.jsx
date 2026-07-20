import { useState, useEffect, useCallback } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useDateNavigation } from "../../hooks/useDateNavigation";
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
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedName, setSelectedName] = useState(null);

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

  useEffect(() => {
    const formattedStartDate = startDate.format("DD-MM-YYYY");
    const formattedEndDate = endDate.format("DD-MM-YYYY");
    dispatch(getStaffUpaadByMonthRange(formattedStartDate, formattedEndDate));
    dispatch(
      getOfficeBookCategoryUpaadByMonthRange(formattedStartDate, formattedEndDate),
    );
    dispatch(getSalarySheetsByMonthRange(formattedStartDate, formattedEndDate));
  }, [dispatch, startDate, endDate]);

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
          Select Date Range:
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            views={["year", "month", "day"]}
            value={startDate}
            onChange={handleStartDateChange}
            format="DD-MM-YYYY"
            slotProps={{ textField: { size: "small" } }}
          />
          <Typography>-</Typography>
          <DatePicker
            views={["year", "month", "day"]}
            value={endDate}
            onChange={handleEndDateChange}
            format="DD-MM-YYYY"
            slotProps={{ textField: { size: "small" } }}
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
          No salary sheet found for {startDate.format("DD-MM-YYYY")} to{" "}
          {endDate.format("DD-MM-YYYY")}
        </Typography>
      )}
    </Box>
  );
};

export default StaffSalaryDashboard;
