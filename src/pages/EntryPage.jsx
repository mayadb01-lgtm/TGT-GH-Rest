import { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TableComponent from "../components/TableComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createEntry } from "../redux/actions/entryAction";
import "dayjs/locale/en-gb";

dayjs.locale("en-gb");
// Utility function to process entries by payment mode
const processEntriesByPaymentMode = (data, mode) => {
  if (data.length === 0) return [];
  return data.filter((row) => row.modeOfPayment === mode);
};

// Reusable SummaryTable component
const SummaryTable = ({ title, dayRows, nightRows, columns }) => {
  const finalRows = [...dayRows, ...nightRows].filter(
    (row) => row.rate !== 0 && row.noOfPeople !== 0
  );

  if (finalRows.length > 0) {
    finalRows[finalRows.length] = {
      id: "Total",
      roomNo: "",
      rate: finalRows.reduce((sum, row) => sum + row.rate, 0),
      fullname: "",
      noOfPeople: "",
    };
  }

  return (
    <Box
      style={{
        margin: 0,
        padding: 0,
        fontSize: "12px",
      }}
    >
      <Stack direction="row" spacing={1} style={{ gap: "8px" }}>
        {" "}
        {/* Compact spacing */}
        <Box style={{ margin: "2px 0", padding: "0", width: "100%" }}>
          {" "}
          {/* Width 50% for side-by-side layout */}
          <Typography
            variant="subtitle2"
            fontWeight={500}
            style={{ marginBottom: "4px" }} // Compact spacing
          >
            {title}
          </Typography>
          <DataGrid
            rows={finalRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            style={{
              fontSize: "12px",
              height: "220px",
              width: "100%",
            }}
            rowHeight={25}
            disableColumnMenu
            disableColumnSorting
            sx={{
              "& .MuiDataGrid-columnHeader": {
                maxHeight: "25px",
              },
              "& .MuiDataGrid-footerContainer": {
                display: "none",
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

const EntryPage = () => {
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  const dispatch = useDispatch();

  const handleDaySubmit = (data) => setDayData(data);
  const handleNightSubmit = (data) => setNightData(data);

  let processedEntries = useMemo(() => {
    const cashDay = processEntriesByPaymentMode(dayData, "Cash");
    const cashNight = processEntriesByPaymentMode(nightData, "Cash");
    const cardDay = processEntriesByPaymentMode(dayData, "Card");
    const cardNight = processEntriesByPaymentMode(nightData, "Card");
    const onlineDay = processEntriesByPaymentMode(dayData, "Online");
    const onlineNight = processEntriesByPaymentMode(nightData, "Online");
    const unpaidDay = processEntriesByPaymentMode(dayData, "UnPaid");
    const unpaidNight = processEntriesByPaymentMode(nightData, "UnPaid");

    return {
      cash: { day: cashDay, night: cashNight },
      card: { day: cardDay, night: cardNight },
      online: { day: onlineDay, night: onlineNight },
      unpaid: { day: unpaidDay, night: unpaidNight },
    };
  }, [dayData, nightData]);

  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "Day/Night", width: 80 },
    { field: "rate", headerName: "Rate", width: 60 },
    { field: "fullname", headerName: "Full Name", width: 100 },
    { field: "noOfPeople", headerName: "People", width: 80 },
  ];

  const calculateTotal = (entries) =>
    entries.reduce((sum, row) => sum + row.rate, 0);

  // Columns for Total DataGrid
  const modeColumns = [
    { field: "id", headerName: "Revenue", width: 150 },
    { field: "totals", headerName: "Total", width: 100 },
  ];

  const modeRows = [
    {
      id: "Cash",
      totals:
        calculateTotal(processedEntries.cash.day) +
        calculateTotal(processedEntries.cash.night),
    },
    {
      id: "Card",
      totals:
        calculateTotal(processedEntries.card.day) +
        calculateTotal(processedEntries.card.night),
    },
    {
      id: "Online",
      totals:
        calculateTotal(processedEntries.online.day) +
        calculateTotal(processedEntries.online.night),
    },
    {
      id: "UnPaid",
      totals:
        calculateTotal(processedEntries.unpaid.day) +
        calculateTotal(processedEntries.unpaid.night),
    },
    { id: "Total", totals: 0 },
  ];

  modeRows[4].totals = modeRows.reduce(
    (sum, row, idx) => (idx < 4 ? sum + row.totals : sum),
    0
  );

  const handleDateChange = (newDate) => {
    if (modeRows[4].totals > 0) {
      if (window.confirm("Are you sure you want to change the date?")) {
        setSelectedDate(dayjs(newDate, "DD-MM-YYYY"));
        setDayData([]);
        setNightData([]);
      }
    }
  };

  const handleEntrySubmit = async () => {
    try {
      if (modeRows[4].totals === 0) {
        toast.error("Please enter some data before submitting.");
        console.log("Please enter some data before submitting.");
      } else {
        const filteredDayData = dayData.filter(
          (row) => row.rate !== 0 && row.noOfPeople !== 0
        );
        const filteredNightData = nightData.filter(
          (row) => row.rate !== 0 && row.noOfPeople !== 0
        );
        const dayEntries = filteredDayData.map((row) => ({
          ...row,
          date: selectedDate,
        }));
        const nightEntries = filteredNightData.map((row) => ({
          ...row,
          date: selectedDate,
        }));

        const combinedEntries = [...dayEntries, ...nightEntries];
        // Do we need to convert the combinedEntries to Stringify?
        const strCombinedEntries = JSON.stringify(combinedEntries);

        const entryObj = {
          entries: strCombinedEntries,
          date: selectedDate,
        };

        // Create a Dialog Box to confirm the submission
        if (
          !window.confirm(
            `Are you sure you want to submit entries for ${selectedDate.format(
              "DD-MM-YYYY"
            )}?`
          )
        ) {
          return;
        }
        console.log("Entry Object", entryObj);
        dispatch(createEntry(entryObj));
        setDayData([]);
        setNightData([]);
        setSelectedDate(dayjs().format("DD-MM-YYYY"));
        // window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting entries", error);
      toast.error("Error submitting entries");
    }
  };

  const handleCancelClick = () => {
    if (window.confirm("Are you sure you want to cancel the entries?")) {
      setDayData([]);
      setNightData([]);
      setSelectedDate(dayjs().format("DD-MM-YYYY"));
      // window.location.reload();
    }
    console.log("Cancelled entries");
  };

  return (
    <>
      <Grid
        container
        direction="row"
        display="flex"
        justifyContent="center"
        alignItems="start"
      >
        {/* Left Side: Day and Night Entry Tables */}
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 7, xl: 7 }}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Box style={{ margin: "0", padding: "0" }}>
              {/* Date Picker */}
              <Stack
                direction="row"
                spacing={1}
                style={{ margin: "0", padding: "0", alignItems: "center" }}
              >
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
                    views={["year", "month", "day"]}
                    value={dayjs(selectedDate, "DD-MM-YYYY")}
                    onChange={(newDate) => handleDateChange(newDate)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        error={false}
                        helperText={null}
                      />
                    )}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: 1,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Stack>
            </Box>
          </Grid>
          <Box>
            {/* Day Entries */}
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="day-entries-content"
                id="day-entries-header"
                style={{
                  backgroundColor: "rbga(41,43,44,0.1)",
                  borderBottom: "1px solid #e0e0e0",
                  minHeight: "0",
                  height: "40px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  flex={1}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Day Entries
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Aashirvad Guest House
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails style={{ margin: "0", padding: "0" }}>
                <TableComponent
                  dayOrNight="Day"
                  title="Day Entry Table"
                  rowsLength={11}
                  roomCosts={{
                    1: 1800,
                    2: 1800,
                    3: 1800,
                    4: 1800,
                    5: 1800,
                    6: 2200,
                    7: 2200,
                    8: 1800,
                    9: 1500,
                    10: 1500,
                    11: 1500,
                  }}
                  onSubmit={handleDaySubmit}
                />
              </AccordionDetails>
            </Accordion>
            {/* Night Entries */}
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="night-entries-content"
                id="night-entries-header"
                style={{
                  backgroundColor: "rbga(41,43,44,0.1)",
                  borderBottom: "1px solid #e0e0e0",
                  minHeight: "0",
                  height: "40px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  flex={1}
                  justifyContent={"space-between"}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Night Entries
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    Aashirvad Guest House
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails style={{ margin: "0", padding: "0" }}>
                <TableComponent
                  dayOrNight="Night"
                  title="Night Entry Table"
                  rowsLength={11}
                  roomCosts={{
                    1: 1800,
                    2: 1800,
                    3: 1800,
                    4: 1800,
                    5: 1800,
                    6: 2200,
                    7: 2200,
                    8: 1800,
                    9: 1500,
                    10: 1500,
                    11: 1500,
                  }}
                  onSubmit={handleNightSubmit}
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>

        {/* Right Side: Filters Table */}
        <Grid size={{ xs: 12, sm: 5, md: 5, lg: 5, xl: 5 }}>
          <Grid
            size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
            display={"flex"}
          >
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Box>
                <Stack
                  direction="column"
                  spacing={0.5}
                  sx={{ padding: "0 8px" }}
                >
                  <SummaryTable
                    title="Cash Entries Summary"
                    dayRows={processedEntries.cash.day}
                    nightRows={processedEntries.cash.night}
                    columns={columns}
                  />
                  <SummaryTable
                    title="Card Entries Summary"
                    dayRows={processedEntries.card.day}
                    nightRows={processedEntries.card.night}
                    columns={columns}
                  />
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Box>
                <Stack
                  direction="column"
                  spacing={0.5}
                  sx={{ padding: "0 8px" }}
                >
                  <SummaryTable
                    title="Online Entries Summary"
                    dayRows={processedEntries.online.day}
                    nightRows={processedEntries.online.night}
                    columns={columns}
                  />
                  <SummaryTable
                    title="UnPaid Entries Summary"
                    dayRows={processedEntries.unpaid.day}
                    nightRows={processedEntries.unpaid.night}
                    columns={columns}
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Stack
              direction="row"
              spacing={1}
              display={"flex"}
              sx={{
                margin: "0",
                width: "100%",
                flex: 1,
              }}
            >
              <Box
                style={{
                  margin: "2px 0",
                  padding: "0",
                  width: "100%",
                  flex: 0.55,
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  fontSize={14}
                  fontWeight={500}
                  style={{ marginInline: "8px" }}
                >
                  Revenue Summary
                </Typography>
                <DataGrid
                  rows={modeRows}
                  columns={modeColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  style={{
                    fontSize: "12px",
                    marginInline: "8px",
                  }}
                  rowHeight={30}
                  disableColumnMenu
                  disableColumnSorting
                  sx={{
                    "& .MuiDataGrid-columnHeader": {
                      maxHeight: "30px",
                    },
                    "& .MuiDataGrid-footerContainer": {
                      display: "none",
                    },
                  }}
                />
              </Box>
              <Box
                style={{
                  margin: "2px 0",
                  padding: "0",
                  width: "100%",
                  flex: 0.5,
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  style={{ margin: "4px" }}
                  color="primary"
                >
                  Save and Submit Entries for Date
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ margin: "2px" }}
                  onClick={handleEntrySubmit}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ margin: "2px" }}
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
      <Toaster position="top-center" />
    </>
  );
};

export default EntryPage;
