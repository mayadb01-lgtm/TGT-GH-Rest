import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import ModernLoader from "../../utils/util";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getRestStaff } from "../../redux/actions/restStaffAction";
import { getStaffUpaadByMonth } from "../../redux/actions/restEntryAction";
import { getOfficeBookCategoryUpaadByMonthAndYear } from "../../redux/actions/officeBookAction";
import {
  getSalarySheet,
  createSalarySheet,
  updateSalarySheet,
  deleteSalarySheet,
} from "../../redux/actions/staffSalaryAction";

dayjs.locale("en-gb");

const tableColumns = [
  "No",
  "Staff Name",
  "Per Day Pay",
  "Attendance",
  "Total",
  "Rest Upaad",
  "Office Upaad",
  "Current Balance",
  "Salary Paid?",
];

const buildDraftRows = (
  staff,
  staffTotalUpaad = {},
  officeBookCategoryUpaad = {},
) =>
  staff.map((s) => {
    const restaurantUpaad = staffTotalUpaad?.[s._id?.toString()] || 0;
    const officeUpaad = officeBookCategoryUpaad?.[s._id?.toString()] || 0;
    const total = Number(s.perDayPay || 0) * Number(s.attendance || 0);
    const currentBalance = total - restaurantUpaad - officeUpaad;

    return {
      staffId: s._id,
      fullname: s.fullname,
      perDayPay: s.perDayPay || 0,
      attendance: 0,
      total,
      restaurantUpaad,
      officeUpaad,
      currentBalance,
      salaryPaid: false,
    };
  });

const StaffSalaryEntryPage = () => {
  const dispatch = useAppDispatch();
  const { loading: staffLoading, restStaff } = useAppSelector(
    (state) => state.restStaff,
  );
  const { loading: staffUpaadLoading, staffTotalUpaad } = useAppSelector(
    (state) => state.restEntry,
  );
  const { loading: officeBookCategoryUpaadLoading, officeBookCategoryUpaad } =
    useAppSelector((state) => state.officeBook);
  const {
    loading: salaryLoading,
    salarySheet,
    salarySheetNotFound,
  } = useAppSelector((state) => state.staffSalary);

  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [rows, setRows] = useState([]);

  const isNew = salarySheetNotFound;

  const month = selectedMonth.month() + 1;
  const year = selectedMonth.year();

  useEffect(() => {
    dispatch(getRestStaff());
    dispatch(getStaffUpaadByMonth(month, year));
    dispatch(getOfficeBookCategoryUpaadByMonthAndYear(month, year));
    dispatch(getSalarySheet(month, year));
  }, [dispatch, month, year]);

  useEffect(() => {
    if (salarySheet && salarySheet.rows?.length > 0) {
      const allRows = salarySheet.rows.map((row) => {
        const restaurantUpaad = staffTotalUpaad?.[row.staffId?.toString()] || 0;
        const officeUpaad =
          officeBookCategoryUpaad?.[row.staffId?.toString()] || 0;
        const total = Number(row.perDayPay || 0) * Number(row.attendance || 0);

        return {
          staffId: row.staffId,
          fullname: row.fullname,
          perDayPay: row.perDayPay || 0,
          attendance: row.attendance || 0,
          total,
          restaurantUpaad,
          officeUpaad,
          currentBalance: total - restaurantUpaad - officeUpaad,
          salaryPaid: Boolean(row.salaryPaid),
        };
      });

      setRows(allRows);
    } else {
      setRows([]);
    }
  }, [salarySheet, staffTotalUpaad, officeBookCategoryUpaad]);

  useEffect(() => {
    if (
      isNew &&
      restStaff?.length > 0 &&
      staffTotalUpaad &&
      officeBookCategoryUpaad
    ) {
      setRows(
        buildDraftRows(restStaff, staffTotalUpaad, officeBookCategoryUpaad),
      );
    }
  }, [isNew, restStaff, staffTotalUpaad, officeBookCategoryUpaad]);

  const resetForm = () => {
    setRows(
      buildDraftRows(restStaff, staffTotalUpaad, officeBookCategoryUpaad),
    );
  };

  const handleRowChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updatedRow = {
          ...row,
          [field]: value,
        };

        updatedRow.total =
          Number(updatedRow.perDayPay || 0) *
          Number(updatedRow.attendance || 0);

        updatedRow.currentBalance =
          updatedRow.total -
          Number(updatedRow.restaurantUpaad || 0) -
          Number(updatedRow.officeUpaad || 0);

        return updatedRow;
      }),
    );
  };

  // Create
  const handleCreate = () => {
    const confirmSubmit = window.confirm(
      `Are you sure you want to create salary sheet for ${selectedMonth.format("MMMM YYYY")}?`,
    );
    if (!confirmSubmit) return;
    const editableRows = rows.map(
      ({ staffId, fullname, perDayPay, attendance, salaryPaid }) => ({
        staffId,
        fullname,
        perDayPay,
        attendance,
        salaryPaid,
      }),
    );
    dispatch(
      createSalarySheet({ month, year, rows: editableRows, remarks: "" }),
    );
  };

  // Update
  const handleUpdate = () => {
    const confirmSubmit = window.confirm(
      `Are you sure you want to update salary sheet for ${selectedMonth.format("MMMM YYYY")}?`,
    );
    if (!confirmSubmit) return;
    const editableRows = rows.map(
      ({ staffId, fullname, perDayPay, attendance, salaryPaid }) => ({
        staffId,
        fullname,
        perDayPay,
        attendance,
        salaryPaid,
      }),
    );
    dispatch(
      updateSalarySheet(month, year, { rows: editableRows, remarks: "" }),
    );
  };

  // Delete
  const handleDelete = () => {
    const confirmSubmit = window.confirm(
      `Are you sure you want to delete salary sheet for ${selectedMonth.format("MMMM YYYY")}?`,
    );
    if (!confirmSubmit) return;
    dispatch(deleteSalarySheet(month, year));
    resetForm();
  };

  const goToPreviousMonth = () => {
    setSelectedMonth(selectedMonth.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setSelectedMonth(selectedMonth.add(1, "month"));
  };

  if (
    salaryLoading ||
    staffUpaadLoading ||
    officeBookCategoryUpaadLoading ||
    staffLoading
  )
    return <ModernLoader />;

  return (
    <>
      <Grid
        container
        spacing={1}
        justifyContent="space-between"
        alignItems="flex-start"
        padding="8px 32px"
        sx={{ width: "100%" }}
      >
        {/* Controls: Title + Month Picker + Buttons */}
        <Grid size={12}>
          <Grid container spacing={3}>
            {/* Title + Month Picker */}
            <Grid size={12}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                <Grid>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ minWidth: "160px" }}
                  >
                    Staff Salary Entry
                  </Typography>
                </Grid>
                <Grid>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en-gb"
                  >
                    <DatePicker
                      views={["year", "month"]}
                      value={selectedMonth}
                      onChange={(newDate) => {
                        if (newDate) setSelectedMonth(newDate);
                      }}
                      format="MMMM YYYY"
                      slots={{
                        textField: (params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            error={false}
                            helperText={null}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-input": { padding: "8.5px 14px" },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                {/* Previous and Next Month Button */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  justifyContent="center"
                  border={1}
                  borderColor="divider"
                  borderRadius={2}
                  p={2}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Month
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={goToPreviousMonth}
                      sx={{
                        minWidth: "40px",
                        padding: "4px",
                      }}
                    >
                      <SkipPreviousRoundedIcon fontSize="small" />
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={goToNextMonth}
                      sx={{
                        minWidth: "40px",
                        padding: "4px",
                      }}
                    >
                      <SkipNextRoundedIcon fontSize="small" />
                    </Button>
                  </Stack>
                </Box>
                {isNew && (
                  <Grid>
                    <Chip
                      label="New Salary Sheet"
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Grid size={12}>
              <Grid container spacing={2}>
                <Grid>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ "&:hover": { backgroundColor: "#e57373" } }}
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                </Grid>

                {!isNew ? (
                  <>
                    <Grid>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUpdate}
                        sx={{ "&:hover": { backgroundColor: "#ab47bc" } }}
                      >
                        Update
                      </Button>
                    </Grid>
                    <Grid>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <Grid>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreate}
                      sx={{ "&:hover": { backgroundColor: "#64b5f6" } }}
                    >
                      Create
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Table */}
        <Grid size={11}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                fontSize: "18px",
                backgroundColor: isNew ? "#fff3e0" : "#e8e2fd",
                padding: "4px 16px",
                borderRadius: "4px",
                width: "fit-content",
                mb: 1,
              }}
            >
              {selectedMonth.format("MMMM YYYY")}
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ maxHeight: "100%", boxShadow: 3 }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {tableColumns.map((col) => (
                      <TableCell key={col} sx={{ fontWeight: "bold" }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={tableColumns.length} align="center">
                        No staff rows found.
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((row, index) => (
                    <TableRow key={row._id ?? index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.fullname}</TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          type="number"
                          size="small"
                          value={row.perDayPay}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "perDayPay",
                              Number(e.target.value),
                            )
                          }
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <TextField
                          variant="outlined"
                          type="number"
                          size="small"
                          value={row.attendance}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "attendance",
                              Number(e.target.value),
                            )
                          }
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          type="number"
                          size="small"
                          value={row.total || 0}
                          disabled
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        <TextField
                          variant="outlined"
                          type="number"
                          size="small"
                          value={row.restaurantUpaad}
                          disabled
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        <TextField
                          variant="outlined"
                          type="number"
                          size="small"
                          value={row.officeUpaad}
                          disabled
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        <TextField
                          variant="outlined"
                          type="number"
                          size="small"
                          value={row.currentBalance || 0}
                          disabled
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={Boolean(row.salaryPaid)}
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "salaryPaid",
                              e.target.checked,
                            )
                          }
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default StaffSalaryEntryPage;
