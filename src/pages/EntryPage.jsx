import { useState, useMemo, useEffect } from "react";
import {
  Typography,
  Box,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createEntry,
  getEntriesByDate,
  getUnPaidEntries,
  updateEntryByDate,
} from "../redux/actions/entryAction";
import "dayjs/locale/en-gb";
import {
  initializePendingJamaRows,
  paymentColors,
  processEntriesByPaymentMode,
  modeSummaryColumn,
  finalModeColumns,
  processEntries,
  processUpdateEntries,
  currentDateTime,
} from "../utils/utils";
import PendingJamaTable from "../components/PendingJamaTable";
import { AccordionSection, EntrySection, PaymentSummary } from "../utils/util";
import PendingJamaGrid from "../components/PendingJamaGrid";
dayjs.locale("en-gb");

const EntryPage = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);
  const [extraDayData, setExtraDayData] = useState([]);
  const [extraNightData, setExtraNightData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  const [pendingJamaRows, setPendingJamaRows] = useState(
    initializePendingJamaRows
  );

  useEffect(() => {
    if (selectedDate && isAdminAuthenticated) {
      dispatch(getEntriesByDate(selectedDate));
    }
  }, [selectedDate, isAdminAuthenticated, dispatch]);

  let processedEntries = useMemo(() => {
    // Cash
    const cashDay = processEntriesByPaymentMode(dayData, "Cash");
    const cashNight = processEntriesByPaymentMode(nightData, "Cash");
    const cashExtraDay = processEntriesByPaymentMode(extraDayData, "Cash");
    const cashExtraNight = processEntriesByPaymentMode(extraNightData, "Cash");
    const pendingJamaCash = pendingJamaRows.filter(
      (row) => row.modeOfPayment === "Cash" && row.period === "UnPaid"
    );
    // Card
    const cardDay = processEntriesByPaymentMode(dayData, "Card");
    const cardNight = processEntriesByPaymentMode(nightData, "Card");
    const cardExtraDay = processEntriesByPaymentMode(extraDayData, "Card");
    const cardExtraNight = processEntriesByPaymentMode(extraNightData, "Card");
    const pendingJamaCard = pendingJamaRows.filter(
      (row) => row.modeOfPayment === "Card" && row.period === "UnPaid"
    );
    // PPS
    const ppsDay = processEntriesByPaymentMode(dayData, "PPS");
    const ppsNight = processEntriesByPaymentMode(nightData, "PPS");
    const ppsExtraDay = processEntriesByPaymentMode(extraDayData, "PPS");
    const ppsExtraNight = processEntriesByPaymentMode(extraNightData, "PPS");
    const pendingJamaPPS = pendingJamaRows.filter(
      (row) => row.modeOfPayment === "PPS" && row.period === "UnPaid"
    );
    // PPC
    const ppcDay = processEntriesByPaymentMode(dayData, "PPC");
    const ppcNight = processEntriesByPaymentMode(nightData, "PPC");
    const ppcExtraDay = processEntriesByPaymentMode(extraDayData, "PPC");
    const ppcExtraNight = processEntriesByPaymentMode(extraNightData, "PPC");
    const pendingJamaPPC = pendingJamaRows.filter(
      (row) => row.modeOfPayment === "PPC" && row.period === "UnPaid"
    );
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
        day: cashDay ? cashDay : [],
        night: cashNight ? cashNight : [],
        extraDay: cashExtraDay ? cashExtraDay : [],
        extraNight: cashExtraNight ? cashExtraNight : [],
        pendingJamaCash: pendingJamaCash ? pendingJamaCash : [],
      },
      card: {
        day: cardDay ? cardDay : [],
        night: cardNight ? cardNight : [],
        extraDay: cardExtraDay ? cardExtraDay : [],
        extraNight: cardExtraNight ? cardExtraNight : [],
        pendingJamaCard: pendingJamaCard ? pendingJamaCard : [],
      },
      pps: {
        day: ppsDay ? ppsDay : [],
        night: ppsNight ? ppsNight : [],
        extraDay: ppsExtraDay ? ppsExtraDay : [],
        extraNight: ppsExtraNight ? ppsExtraNight : [],
        pendingJamaPPS: pendingJamaPPS ? pendingJamaPPS : [],
      },
      ppc: {
        day: ppcDay ? ppcDay : [],
        night: ppcNight ? ppcNight : [],
        extraDay: ppcExtraDay ? ppcExtraDay : [],
        extraNight: ppcExtraNight ? ppcExtraNight : [],
        pendingJamaPPC: pendingJamaPPC ? pendingJamaPPC : [],
      },
      unpaid: {
        day: unpaidDay ? unpaidDay : [],
        night: unpaidNight ? unpaidNight : [],
        extraDay: unpaidExtraDay ? unpaidExtraDay : [],
        extraNight: unpaidExtraNight ? unpaidExtraNight : [],
      },
    };
  }, [dayData, nightData, extraDayData, extraNightData, pendingJamaRows]);

  const calculateTotal = (entries) =>
    entries
      ? entries.reduce((sum, row) => Number(sum) + Number(row.rate), 0)
      : 0;

  const modeRows = [
    {
      id: "Cash",
      totals:
        calculateTotal(processedEntries.cash.day) +
        calculateTotal(processedEntries.cash.night) +
        calculateTotal(processedEntries.cash.extraDay) +
        calculateTotal(processedEntries.cash.extraNight) +
        calculateTotal(processedEntries.cash.pendingJamaCash),
    },
    {
      id: "Card",
      totals:
        calculateTotal(processedEntries.card.day) +
        calculateTotal(processedEntries.card.night) +
        calculateTotal(processedEntries.card.extraDay) +
        calculateTotal(processedEntries.card.extraNight) +
        calculateTotal(processedEntries.card.pendingJamaCard),
    },
    {
      id: "PPS",
      totals:
        calculateTotal(processedEntries.pps.day) +
        calculateTotal(processedEntries.pps.night) +
        calculateTotal(processedEntries.pps.extraDay) +
        calculateTotal(processedEntries.pps.extraNight) +
        calculateTotal(processedEntries.pps.pendingJamaPPS),
    },
    {
      id: "PPC",
      totals:
        calculateTotal(processedEntries.ppc.day) +
        calculateTotal(processedEntries.ppc.night) +
        calculateTotal(processedEntries.ppc.extraDay) +
        calculateTotal(processedEntries.ppc.extraNight) +
        calculateTotal(processedEntries.ppc.pendingJamaPPC),
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
    (sum, row, idx) => (idx < 5 ? Number(sum) + Number(row.totals) : sum),
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
        setPendingJamaRows(initializePendingJamaRows);
      }
    } else {
      setSelectedDate(newDate.format("DD-MM-YYYY"));
      setDayData([]);
      setNightData([]);
      setExtraDayData([]);
      setExtraNightData([]);
      setPendingJamaRows(initializePendingJamaRows);
    }
  };

  const resetForm = (
    setDayData,
    setNightData,
    setExtraDayData,
    setExtraNightData,
    setPendingJamaRows
  ) => {
    setDayData([]);
    setNightData([]);
    setExtraDayData([]);
    setExtraNightData([]);
    setPendingJamaRows(initializePendingJamaRows);
    setSelectedDate(dayjs().format("DD-MM-YYYY"));
  };

  const handleEntrySubmit = async () => {
    try {
      if (modeRows[5].totals === 0) {
        toast.error("Please enter some data before submitting.");
        console.warn("No data to submit.");
        return;
      }

      const dayEntries = processEntries(
        dayData,
        "day",
        selectedDate,
        currentDateTime
      );
      const nightEntries = processEntries(
        nightData,
        "night",
        selectedDate,
        currentDateTime
      );
      const extraDayEntries = processEntries(
        extraDayData,
        "extraDay",
        selectedDate,
        currentDateTime
      );
      const extraNightEntries = processEntries(
        extraNightData,
        "extraNight",
        selectedDate,
        currentDateTime
      );

      // Handle Pending Jama Entries
      const pendingJamaEntryFilteredRows = pendingJamaRows.filter(
        (row) =>
          row.date !== "" &&
          row.roomNo !== "" &&
          row.fullname !== "" &&
          row.mobileNumber !== "" &&
          row.rate !== 0 &&
          row.modeOfPayment !== ""
      );

      let pendingJamaEntries = [];
      if (pendingJamaEntryFilteredRows.length > 0) {
        pendingJamaEntries = pendingJamaEntryFilteredRows.map((row) => ({
          ...row,
          period: row.period,
          date: row.date,
        }));
      }

      const combinedEntries = [
        ...dayEntries,
        ...nightEntries,
        ...extraDayEntries,
        ...extraNightEntries,
        ...pendingJamaEntries,
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

      console.log("Submitting Entries", combinedEntries);
      dispatch(createEntry(entryObj));

      resetForm(
        setDayData,
        setNightData,
        setExtraDayData,
        setExtraNightData,
        setPendingJamaRows,
        setSelectedDate
      );
      dispatch(getUnPaidEntries());
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

      const dayEntries = processUpdateEntries(dayData, "day", selectedDate);
      const nightEntries = processUpdateEntries(
        nightData,
        "night",
        selectedDate
      );
      const extraDayEntries = processUpdateEntries(
        extraDayData,
        "extraDay",
        selectedDate
      );
      const extraNightEntries = processUpdateEntries(
        extraNightData,
        "extraNight",
        selectedDate
      );

      // Handle Pending Jama Entries
      const pendingJamaEntryFilteredRows = pendingJamaRows.filter(
        (row) =>
          row.date !== "" &&
          row.roomNo !== "" &&
          row.fullname !== "" &&
          row.mobileNumber !== "" &&
          row.rate !== 0 &&
          row.modeOfPayment !== ""
      );

      let pendingJamaEntries = [];
      if (pendingJamaEntryFilteredRows.length > 0) {
        pendingJamaEntries = pendingJamaEntryFilteredRows.map((row) => ({
          ...row,
          period: row.period,
          date: row.date,
        }));

        console.log("Pending Jama Entries", pendingJamaEntries);
      }

      const combinedEntries = [
        ...dayEntries,
        ...nightEntries,
        ...extraDayEntries,
        ...extraNightEntries,
        ...pendingJamaEntries,
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

        console.log("Editing Entries", combinedEntries);
        dispatch(updateEntryByDate(selectedDate, entryObj));

        resetForm(
          setDayData,
          setNightData,
          setExtraDayData,
          setExtraNightData,
          setPendingJamaRows,
          setSelectedDate
        );
        dispatch(getUnPaidEntries());
      } else {
        toast.error("You are not authorized to edit entries.");
        console.warn("Unauthorized access.");
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
          setPendingJamaRows,
          setSelectedDate
        );
      }
    } else {
      resetForm(
        setDayData,
        setNightData,
        setExtraDayData,
        setExtraNightData,
        setPendingJamaRows,
        setSelectedDate
      );
    }
  };

  if (!selectedDate) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
          padding: 2,
        }}
      >
        <CircularProgress fontSize="large" />
      </Box>
    );
  }

  return (
    <>
      <Grid
        container
        direction="row"
        display="flex"
        justifyContent="center"
        alignItems="start"
        sx={{
          backgroundColor: "#f4f6f5",
        }}
      >
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
            <EntrySection
              selectedDate={selectedDate}
              setDayData={setDayData}
              setNightData={setNightData}
              setExtraDayData={setExtraDayData}
              setExtraNightData={setExtraNightData}
            />
            <AccordionSection bgColor="#ADC865" title="Pending Jama Entries">
              <PendingJamaTable
                pendingJamaRows={pendingJamaRows}
                setPendingJamaRows={setPendingJamaRows}
              />
            </AccordionSection>

            <AccordionSection
              bgColor="#d2d2d2"
              title="View UnPaid Entries Till Date"
            >
              <PendingJamaGrid />
            </AccordionSection>
          </Box>
        </Grid>
        {/* Right Side: Filters Table */}
        <PaymentSummary
          processedEntries={processedEntries}
          columns={modeSummaryColumn}
          paymentColors={paymentColors}
          modeRows={modeRows}
          modeColumns={finalModeColumns}
          isAdminAuthenticated={isAdminAuthenticated}
          handleEntrySubmit={handleEntrySubmit}
          handleEntryEdit={handleEntryEdit}
          handleCancelClick={handleCancelClick}
        />
      </Grid>
      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
};

export default EntryPage;
