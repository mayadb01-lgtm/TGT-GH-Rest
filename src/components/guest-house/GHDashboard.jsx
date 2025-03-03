import { useEffect, useState, useCallback } from "react";
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
import { getEntriesByDate } from "../../redux/actions/entryAction";
import dayjs from "dayjs";

dayjs.locale("en-gb");

const GHDashboard = () => {
  const dispatch = useAppDispatch();
  const { loading, entries } = useAppSelector((state) => state.entry);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );

  const handleDateChange = useCallback(
    (newDate) => {
      if (newDate) {
        const formattedDate = newDate.format("DD-MM-YYYY");
        if (formattedDate !== selectedDate) {
          setSelectedDate(formattedDate);
        }
      }
    },
    [selectedDate]
  );

  useEffect(() => {
    dispatch(getEntriesByDate(selectedDate));
  }, [dispatch, selectedDate]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "roomNo", headerName: "Room No", width: 130 },
    { field: "cost", headerName: "Price", width: 100 },
    { field: "rate", headerName: "Rate", width: 100 },
    { field: "noOfPeople", headerName: "People", width: 100 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "modeOfPayment", headerName: "Payment Mode", width: 140 },
    { field: "checkInTime", headerName: "Check In", width: 130 },
    { field: "checkOutTime", headerName: "Check Out", width: 130 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "period", headerName: "Period", width: 110 },
    { field: "createDate", headerName: "Created At", width: 140 },
  ];

  return (
    <Box
      sx={{
        py: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
          Select Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            value={dayjs(selectedDate, "DD-MM-YYYY")}
            onChange={handleDateChange}
            format="DD-MM-YYYY"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                fullWidth
              />
            )}
          />
        </LocalizationProvider>
      </Stack>
      {loading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : (
        <DataGrid
          rows={entries}
          columns={columns}
          pageSize={5}
          sx={{ mt: 2, height: 400 }}
        />
      )}
    </Box>
  );
};

export default GHDashboard;
