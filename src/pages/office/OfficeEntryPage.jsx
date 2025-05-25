import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid2";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import OfficeBookTable from "../../components/office/OfficeBookTable";
import {
  createOfficeBook,
  deleteOfficeBookByDate,
  getOfficeBookByDate,
  updateOfficeBookByDate,
} from "../../redux/actions/officeBookAction";
import ModernLoader from "../../utils/util";
import toast from "react-hot-toast";
dayjs.locale("en-gb");

const OfficeEntryPage = () => {
  const dispatch = useAppDispatch();
  const { loading, officeBook } = useAppSelector((state) => state.officeBook);
  const { isAdminAuthenticated } = useAppSelector((state) => state.admin);
  const today = dayjs().format("DD-MM-YYYY");

  const makeInitialRows = (date, count = 8) =>
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      amount: 0,
      fullname: "",
      category: "",
      remark: "",
      createDate: date,
    }));
  const [officeInData, setOfficeInData] = useState(() =>
    makeInitialRows(today)
  );
  const [officeOutData, setOfficeOutData] = useState(() =>
    makeInitialRows(today)
  );
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    if (selectedDate) {
      dispatch(getOfficeBookByDate(selectedDate));
    }
  }, [dispatch, selectedDate]);

  useEffect(() => {
    if (!officeBook) return;

    if (
      (!officeBook.officeIn || officeBook.officeIn.length === 0) &&
      (!officeBook.officeOut || officeBook.officeOut.length === 0)
    ) {
      resetForm();
      return;
    }
    resetForm();
    if (officeBook.officeIn) setOfficeInData(officeBook.officeIn);
    if (officeBook.officeOut) setOfficeOutData(officeBook.officeOut);
  }, [officeBook, selectedDate]);

  const handleDateChange = (newDate) => {
    if (newDate) {
      const formattedDate = newDate.format("DD-MM-YYYY");
      if (formattedDate !== selectedDate) {
        setSelectedDate(formattedDate);
      }
    }
  };

  const resetForm = () => {
    const rows = makeInitialRows(selectedDate); // Use current selected date
    setOfficeInData(rows);
    setOfficeOutData(rows);
  };

  const processOfficeData = (data) => {
    return data.filter((row) => row.amount > 0 && row.fullname && row.category);
  };

  const officeBookData = useMemo(() => {
    const processedOfficeIn = processOfficeData(officeInData);
    const processedOfficeOut = processOfficeData(officeOutData);
    return {
      officeIn: JSON.stringify(processedOfficeIn),
      officeOut: JSON.stringify(processedOfficeOut),
      createDate: selectedDate,
    };
  }, [officeInData, officeOutData, selectedDate]);

  // Submit Entry
  const handleOfficeSubmit = async () => {
    try {
      const confirmSubmit = window.confirm(
        `Are you sure you want to submit office book for ${selectedDate}?`
      );
      if (!confirmSubmit) return;
      dispatch(createOfficeBook(officeBookData));
      setSelectedDate(today);
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the entry."
      );
    }
  };

  // Update Entry
  const handleUpdateOfficeSubmit = async () => {
    try {
      const confirmSubmit = window.confirm(
        `Are you sure you want to update office book for ${selectedDate}?`
      );
      if (!confirmSubmit) return;
      dispatch(updateOfficeBookByDate(selectedDate, officeBookData));
      setSelectedDate(today);
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating the entry."
      );
    }
  };

  // Delete Entry
  const handleDeleteOfficeSubmit = async () => {
    try {
      const confirmSubmit = window.confirm(
        `Are you sure you want to delete office book for ${selectedDate}?`
      );
      if (!confirmSubmit) return;
      dispatch(deleteOfficeBookByDate(selectedDate));
      setSelectedDate(today);
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the entry."
      );
    }
  };

  if (loading) {
    return <ModernLoader />;
  } else {
    console.log("Office Book", officeBook);
    return (
      <>
        <Grid
          container
          direction="row"
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          padding={"8px 32px"}
        >
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Box style={{ margin: "0", padding: "0" }}>
              {/* Date Picker */}
              <Stack
                direction="row"
                spacing={1}
                style={{ margin: "0", padding: "0", alignItems: "center" }}
              >
                {/* Office Book Entry - Heading */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  style={{ margin: 0 }}
                >
                  Office Book Entry
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  style={{ margin: "12px" }}
                >
                  Select Date
                </Typography>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    format="DD-MM-YYYY"
                    views={["year", "month", "day"]}
                    value={
                      selectedDate
                        ? dayjs(selectedDate, "DD-MM-YYYY")
                        : dayjs(today, "DD-MM-YYYY")
                    }
                    onChange={(newDate) => handleDateChange(newDate)}
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
                      "& .MuiInputBase-input": {
                        padding: 1,
                      },
                    }}
                    disableFuture={isAdminAuthenticated ? false : true}
                    disablePast={isAdminAuthenticated ? false : true}
                  />
                </LocalizationProvider>
              </Stack>
            </Box>
          </Grid>
          {/* Office In */}
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5.95, xl: 5.95 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    fontSize: "18px",
                    backgroundColor: "#e8e2fd",
                    padding: "4px 16px",
                    borderRadius: "4px",
                    width: "fit-content",
                  }}
                >
                  Office In
                </Typography>
                <OfficeBookTable
                  officeData={officeInData}
                  setOfficeData={setOfficeInData}
                />
              </Box>
            </Grid>
          </Grid>
          {/* Office Out */}
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5.95, xl: 5.95 }}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    fontSize: "18px",
                    backgroundColor: "#fee1ff",
                    padding: "4px 16px",
                    borderRadius: "4px",
                    width: "fit-content",
                  }}
                >
                  Office Out
                </Typography>
                <OfficeBookTable
                  officeData={officeOutData}
                  setOfficeData={setOfficeOutData}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: "16px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                sx={{ mx: 1, "&:hover": { backgroundColor: "#e57373" } }}
                onClick={resetForm}
              >
                Reset
              </Button>
              {officeBook && (officeBook.officeIn || officeBook.officeOut) ? (
                <>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      mx: 1,
                      "&:hover": { backgroundColor: "secondary" },
                    }}
                    onClick={handleUpdateOfficeSubmit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ mx: 1 }}
                    onClick={handleDeleteOfficeSubmit}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mx: 1,
                    "&:hover": { backgroundColor: "#64b5f6" },
                  }}
                  onClick={handleOfficeSubmit}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default OfficeEntryPage;
