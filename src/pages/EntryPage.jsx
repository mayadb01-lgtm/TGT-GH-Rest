import { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TableComponent from "../components/TableComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createEntry, updateEntryByDate } from "../redux/actions/entryAction";
import "dayjs/locale/en-gb";
import SummaryTable from "../components/SummaryTable";
import { paymentColors, processEntriesByPaymentMode } from "../utils/utils";
dayjs.locale("en-gb");

const EntryPage = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);
  const [extraDayData, setExtraDayData] = useState([]);
  const [extraNightData, setExtraNightData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  const dispatch = useDispatch();

  let processedEntries = useMemo(() => {
    // Cash
    const cashDay = processEntriesByPaymentMode(dayData, "Cash");
    const cashNight = processEntriesByPaymentMode(nightData, "Cash");
    const cashExtraDay = processEntriesByPaymentMode(extraDayData, "Cash");
    const cashExtraNight = processEntriesByPaymentMode(extraNightData, "Cash");
    // Card
    const cardDay = processEntriesByPaymentMode(dayData, "Card");
    const cardNight = processEntriesByPaymentMode(nightData, "Card");
    const cardExtraDay = processEntriesByPaymentMode(extraDayData, "Card");
    const cardExtraNight = processEntriesByPaymentMode(extraNightData, "Card");
    // PPS
    const ppsDay = processEntriesByPaymentMode(dayData, "PPS");
    const ppsNight = processEntriesByPaymentMode(nightData, "PPS");
    const ppsExtraDay = processEntriesByPaymentMode(extraDayData, "PPS");
    const ppsExtraNight = processEntriesByPaymentMode(extraNightData, "PPS");
    // PPC
    const ppcDay = processEntriesByPaymentMode(dayData, "PPC");
    const ppcNight = processEntriesByPaymentMode(nightData, "PPC");
    const ppcExtraDay = processEntriesByPaymentMode(extraDayData, "PPC");
    const ppcExtraNight = processEntriesByPaymentMode(extraNightData, "PPC");
    // UnPaid
    const unpaidDay = processEntriesByPaymentMode(dayData, "UnPaid");
    const unpaidNight = processEntriesByPaymentMode(nightData, "UnPaid");
    const unpaidExtraDay = processEntriesByPaymentMode(extraDayData, "UnPaid");
    const unpaidExtraNight = processEntriesByPaymentMode(
      extraNightData,
      "UnPaid"
    );

    return {
      cash: {
        day: cashDay,
        night: cashNight,
        extraDay: cashExtraDay,
        extraNight: cashExtraNight,
      },
      card: {
        day: cardDay,
        night: cardNight,
        extraDay: cardExtraDay,
        extraNight: cardExtraNight,
      },
      pps: {
        day: ppsDay,
        night: ppsNight,
        extraDay: ppsExtraDay,
        extraNight: ppsExtraNight,
      },
      ppc: {
        day: ppcDay,
        night: ppcNight,
        extraDay: ppcExtraDay,
        extraNight: ppcExtraNight,
      },
      unpaid: {
        day: unpaidDay,
        night: unpaidNight,
        extraDay: unpaidExtraDay,
        extraNight: unpaidExtraNight,
      },
    };
  }, [dayData, nightData, extraDayData, extraNightData]);

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
    { field: "id", headerName: "Revenue", width: "160" },
    { field: "totals", headerName: "Total", width: "160" },
  ];

  const modeRows = [
    {
      id: "Cash",
      totals:
        calculateTotal(processedEntries.cash.day) +
        calculateTotal(processedEntries.cash.night) +
        calculateTotal(processedEntries.cash.extraDay) +
        calculateTotal(processedEntries.cash.extraNight),
    },
    {
      id: "Card",
      totals:
        calculateTotal(processedEntries.card.day) +
        calculateTotal(processedEntries.card.night) +
        calculateTotal(processedEntries.card.extraDay) +
        calculateTotal(processedEntries.card.extraNight),
    },
    {
      id: "PPS",
      totals:
        calculateTotal(processedEntries.pps.day) +
        calculateTotal(processedEntries.pps.night) +
        calculateTotal(processedEntries.pps.extraDay) +
        calculateTotal(processedEntries.pps.extraNight),
    },
    {
      id: "PPC",
      totals:
        calculateTotal(processedEntries.ppc.day) +
        calculateTotal(processedEntries.ppc.night) +
        calculateTotal(processedEntries.ppc.extraDay) +
        calculateTotal(processedEntries.ppc.extraNight),
    },
    {
      id: "UnPaid",
      totals:
        calculateTotal(processedEntries.unpaid.day) +
        calculateTotal(processedEntries.unpaid.night) +
        calculateTotal(processedEntries.unpaid.extraDay) +
        calculateTotal(processedEntries.unpaid.extraNight),
    },
    { id: "Total", totals: 0 },
  ];

  modeRows[5].totals = modeRows.reduce(
    (sum, row, idx) => (idx < 4 ? sum + row.totals : sum),
    0
  );

  const handleDateChange = (newDate) => {
    if (modeRows[5].totals > 0) {
      if (window.confirm("Are you sure you want to change the date?")) {
        setSelectedDate(newDate.format("DD-MM-YYYY"));
        setDayData([]);
        setNightData([]);
        setExtraDayData([]);
        setExtraNightData([]);
      }
    } else {
      setSelectedDate(newDate.format("DD-MM-YYYY"));
      setDayData([]);
      setNightData([]);
      setExtraDayData([]);
      setExtraNightData([]);
    }
  };

  const processEntries = (data, period, selectedDate) => {
    return data
      .filter(
        (row) =>
          row.rate !== 0 &&
          row.noOfPeople !== 0 &&
          row.type !== "" &&
          row.modeOfPayment !== ""
      )
      .map((row) => ({
        ...row,
        period,
        date: selectedDate,
      }))
      .sort((a, b) => a.roomNo - b.roomNo);
  };

  const resetForm = (
    setDayData,
    setNightData,
    setExtraDayData,
    setExtraNightData,
    setSelectedDate
  ) => {
    setDayData([]);
    setNightData([]);
    setExtraDayData([]);
    setExtraNightData([]);
    setSelectedDate(dayjs().format("DD-MM-YYYY"));
  };

  const handleEntrySubmit = async () => {
    try {
      if (modeRows[5].totals === 0) {
        toast.error("Please enter some data before submitting.");
        console.warn("No data to submit.");
        return;
      }

      const dayEntries = processEntries(dayData, "day", selectedDate);
      const nightEntries = processEntries(nightData, "night", selectedDate);
      const extraDayEntries = processEntries(
        extraDayData,
        "extraDay",
        selectedDate
      );
      const extraNightEntries = processEntries(
        extraNightData,
        "extraNight",
        selectedDate
      );

      const combinedEntries = [
        ...dayEntries,
        ...nightEntries,
        ...extraDayEntries,
        ...extraNightEntries,
      ];

      if (combinedEntries.length === 0) {
        toast.error("No valid entries to submit.");
        console.warn("Filtered data resulted in no entries.");
        return;
      }

      const entryObj = {
        entries: JSON.stringify(combinedEntries),
        date: selectedDate,
      };

      const confirmSubmit = window.confirm(
        `Are you sure you want to submit entries for ${selectedDate}?`
      );

      if (!confirmSubmit) return;

      console.log("Submitting Entries", entryObj);
      dispatch(createEntry(entryObj));

      resetForm(
        setDayData,
        setNightData,
        setExtraDayData,
        setExtraNightData,
        setSelectedDate
      );
    } catch (error) {
      console.error("Error submitting entries:", error);
      toast.error(
        "An error occurred while submitting entries. Please try again."
      );
    }
  };

  const handleEntryEdit = () => {
    try {
      if (modeRows[5].totals === 0) {
        toast.error("Please enter some data before submitting.");
        console.warn("No data to submit.");
        return;
      }

      const dayEntries = processEntries(dayData, "day", selectedDate);
      const nightEntries = processEntries(nightData, "night", selectedDate);
      const extraDayEntries = processEntries(
        extraDayData,
        "extraDay",
        selectedDate
      );
      const extraNightEntries = processEntries(
        extraNightData,
        "extraNight",
        selectedDate
      );

      const combinedEntries = [
        ...dayEntries,
        ...nightEntries,
        ...extraDayEntries,
        ...extraNightEntries,
      ];

      if (combinedEntries.length === 0) {
        toast.error("No valid entries to submit.");
        console.warn("Filtered data resulted in no entries.");
        return;
      }

      const entryObj = {
        entries: JSON.stringify(combinedEntries),
        date: selectedDate,
      };

      if (isAdminAuthenticated) {
        const confirmEdit = window.confirm(
          `Are you sure you want to edit entries for ${selectedDate}?`
        );

        if (!confirmEdit) return;

        console.log("Editing Entries", entryObj);
        dispatch(updateEntryByDate(selectedDate, entryObj));

        resetForm(
          setDayData,
          setNightData,
          setExtraDayData,
          setExtraNightData,
          setSelectedDate
        );
      }
    } catch (error) {
      console.error("Error submitting entries:", error);
      toast.error(
        "An error occurred while submitting entries. Please try again."
      );
    }
  };

  const handleCancelClick = () => {
    if (modeRows[5].totals > 0) {
      if (window.confirm("Are you sure you want to cancel?")) {
        resetForm(
          setDayData,
          setNightData,
          setExtraDayData,
          setExtraNightData,
          setSelectedDate
        );
      }
    } else {
      resetForm(
        setDayData,
        setNightData,
        setExtraDayData,
        setExtraNightData,
        setSelectedDate
      );
    }
  };

  console.log("Day Data Home", dayData);
  console.log("Night Data Home", nightData);
  console.log("Extra Day Data Home", extraDayData);
  console.log("Extra Night Data Home", extraNightData);

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
                    disableFuture={isAdminAuthenticated ? false : true}
                    disablePast={isAdminAuthenticated ? false : true}
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
                style={{
                  backgroundColor: "rbga(41,43,44,0.1)",
                  border: "1px solid #e0e0e0",
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
                  selectedDate={selectedDate}
                  period="Day"
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
                  onSubmit={setDayData}
                />
              </AccordionDetails>
            </Accordion>
            {/* Night Entries */}
            {/* Divider - Seperator */}
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
                  selectedDate={selectedDate}
                  period="Night"
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
                  onSubmit={setNightData}
                />
              </AccordionDetails>
            </Accordion>
            <Box sx={{ height: "8px" }} />
            {/* Extra Day Entries */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{
                  backgroundColor: "rbga(41,43,44,0.1)",
                  border: "1px solid #e0e0e0",
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
                    Extra Day Entries
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
                  selectedDate={selectedDate}
                  period="extraDay"
                  title="Extra Day Entry Table"
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
                  onSubmit={setExtraDayData}
                />
              </AccordionDetails>
            </Accordion>
            {/* Extra Night Entries */}
            <Accordion>
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
                    Extra Night Entries
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
                  selectedDate={selectedDate}
                  period="extraNight"
                  title={"Extra Night Entry Table"}
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
                  onSubmit={setExtraNightData}
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>

        {/* Right Side: Filters Table */}
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5, xl: 5 }}>
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
                    extraDayRows={processedEntries.cash.extraDay}
                    extraNightRows={processedEntries.cash.extraNight}
                    columns={columns}
                    color={paymentColors.Cash}
                  />
                  <SummaryTable
                    title="Card Entries Summary"
                    dayRows={processedEntries.card.day}
                    nightRows={processedEntries.card.night}
                    extraDayRows={processedEntries.card.extraDay}
                    extraNightRows={processedEntries.card.extraNight}
                    columns={columns}
                    color={paymentColors.Card}
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
                    title="PPS Entries Summary"
                    dayRows={processedEntries.pps.day}
                    nightRows={processedEntries.pps.night}
                    extraDayRows={processedEntries.pps.extraDay}
                    extraNightRows={processedEntries.pps.extraNight}
                    columns={columns}
                    color={paymentColors.PPS}
                  />
                  <SummaryTable
                    title="PPC Entries Summary"
                    dayRows={processedEntries.ppc.day}
                    nightRows={processedEntries.ppc.night}
                    extraDayRows={processedEntries.ppc.extraDay}
                    extraNightRows={processedEntries.ppc.extraNight}
                    columns={columns}
                    color={paymentColors.PPC}
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>
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
                    title="UnPaid Entries Summary"
                    dayRows={processedEntries.unpaid.day}
                    nightRows={processedEntries.unpaid.night}
                    extraDayRows={processedEntries.unpaid.extraDay}
                    extraNightRows={processedEntries.unpaid.extraNight}
                    columns={columns}
                    color={paymentColors.UnPaid}
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
                    title="Revenue Summary"
                    dayRows={modeRows}
                    nightRows={[]}
                    columns={modeColumns}
                    color={paymentColors.Select}
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box
              sx={{ px: 2 }}
              flexDirection={"row"}
              display={"flex"}
              alignItems={"center"}
              gap={2}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Submit Entries
              </Typography>
              <Stack direction="row" spacing={1}>
                {isAdminAuthenticated && (
                  <Button
                    onClick={handleEntryEdit}
                    variant="contained"
                    color="success"
                    sx={{
                      px: 3,
                      "&:hover": {
                        backgroundColor: "#81c784",
                      },
                    }}
                  >
                    Update
                  </Button>
                )}
                <Button
                  onClick={handleEntrySubmit}
                  variant="contained"
                  color="success"
                  sx={{
                    px: 3,
                    "&:hover": {
                      backgroundColor: "#81c784",
                    },
                  }}
                >
                  Submit
                </Button>
                <Button
                  onClick={handleCancelClick}
                  variant="contained"
                  color="error"
                  sx={{
                    px: 3,
                    "&:hover": {
                      backgroundColor: "#e57373",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Toaster position="top-center" />
    </>
  );
};

export default EntryPage;
