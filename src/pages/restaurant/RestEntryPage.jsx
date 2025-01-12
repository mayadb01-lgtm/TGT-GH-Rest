import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RestUpadTable from "../../components/restaurant/RestUpadTable";
import RestExpensesTable from "../../components/restaurant/RestExpensesTable";
import RestPendingTable from "../../components/restaurant/RestPendingTable";
import toast from "react-hot-toast";
import {
  createRestEntry,
  getRestEntryByDate,
} from "../../redux/actions/restEntryAction";
// import {
//   categories,
//   fullNameOptions,
//   mobileNumberOptions,
// } from "../../utils/utils";
dayjs.locale("en-gb");

const RestEntryPage = () => {
  const dispatch = useDispatch();
  const { restEntries } = useSelector((state) => state.restEntry);
  const { isAdminAuthenticated } = useSelector((state) => state.admin);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  // Upad
  const restUpadInitialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    amount: 0,
    fullname: "",
    mobileNumber: 0,
    createDate: selectedDate,
  }));
  const [restUpadData, setRestUpadData] = useState(restUpadInitialData);
  // Pending
  const restPendingInitialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    fullname: "",
    mobileNumber: 0,
    amount: 0,
    createDate: selectedDate,
  }));
  const [restPendingData, setRestPendingData] = useState(
    restPendingInitialData
  );
  // Expenses
  const restExpensesInitialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    amount: 0,
    fullname: "",
    mobileNumber: 0,
    category: 0,
    createDate: selectedDate,
  }));
  const [restExpensesData, setRestExpensesData] = useState(
    restExpensesInitialData
  );
  const [totalUpad, setTotalUpad] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalCard, setTotalCard] = useState(0);
  const [totalPP, setTotalPP] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [extraAmount, setExtraAmount] = useState(0);
  useMemo(() => {
    const total = restUpadData.reduce((acc, row) => {
      return acc + Number(row.amount);
    }, 0);
    setTotalUpad(total);
  }, [restUpadData]);

  useMemo(() => {
    const total = restPendingData.reduce((acc, row) => {
      return acc + Number(row.amount);
    }, 0);
    setTotalPending(total);
  }, [restPendingData]);

  useMemo(() => {
    const total = restExpensesData.reduce((acc, row) => {
      return acc + Number(row.amount);
    }, 0);
    setTotalExpenses(total);
  }, [restExpensesData]);

  useMemo(() => {
    const total =
      totalUpad +
      totalPending +
      totalExpenses +
      extraAmount +
      totalCard +
      totalPP +
      totalCash;
    setGrandTotal(total);
  }, [
    totalUpad,
    totalPending,
    totalExpenses,
    extraAmount,
    totalCard,
    totalPP,
    totalCash,
  ]);

  useEffect(() => {
    if (selectedDate) {
      dispatch(getRestEntryByDate(selectedDate));
    }
  }, [dispatch, selectedDate]);

  useEffect(() => {
    if (selectedDate && restEntries && restEntries.grandTotal > 0) {
      resetForm();
      setRestUpadData(restEntries.upad);
      setRestPendingData(restEntries.pending);
      setRestExpensesData(restEntries.expenses);
      setExtraAmount(restEntries.extraAmount);
      setTotalUpad(restEntries.totalUpad);
      setTotalPending(restEntries.totalPending);
      setTotalExpenses(restEntries.totalExpenses);
      setTotalCard(restEntries.totalCard);
      setTotalPP(restEntries.totalPP);
      setTotalCash(restEntries.totalCash);
      setGrandTotal(restEntries.grandTotal);
    }
  }, [selectedDate, restEntries]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate.format("DD-MM-YYYY"));
  };

  const restEntryData = useMemo(() => {
    return {
      createDate: selectedDate,
      date: selectedDate,
      upad: JSON.stringify(restUpadData),
      pending: JSON.stringify(restPendingData),
      expenses: JSON.stringify(restExpensesData),
      extraAmount: extraAmount,
      totalUpad: totalUpad,
      totalPending: totalPending,
      totalExpenses: totalExpenses,
      totalCard: totalCard,
      totalPP: totalPP,
      totalCash: totalCash,
      grandTotal: grandTotal,
    };
  }, [
    selectedDate,
    restUpadData,
    restPendingData,
    restExpensesData,
    extraAmount,
    totalUpad,
    totalPending,
    totalExpenses,
    totalCard,
    totalPP,
    totalCash,
    grandTotal,
  ]);

  const submitEntryValidation = () => {
    if (!selectedDate) {
      toast.error("Please select a date.");
      return false;
    }

    if (!restUpadData || restUpadData.length === 0) {
      toast.error("Upad data is required.");
      return false;
    }

    if (!restPendingData || restPendingData.length === 0) {
      toast.error("Pending data is required.");
      return false;
    }

    if (!restExpensesData || restExpensesData.length === 0) {
      toast.error("Expenses data is required.");
      return false;
    }

    if (extraAmount === undefined || extraAmount === null) {
      toast.error("Extra amount is required.");
      return false;
    }

    if (totalUpad === undefined || totalUpad === null) {
      toast.error("Total Upad is required.");
      return false;
    }

    if (totalPending === undefined || totalPending === null) {
      toast.error("Total Pending is required.");
      return false;
    }

    if (totalExpenses === undefined || totalExpenses === null) {
      toast.error("Total Expenses is required.");
      return false;
    }

    if (totalCard === undefined || totalCard === null) {
      toast.error("Total Card is required.");
      return false;
    }

    if (totalPP === undefined || totalPP === null) {
      toast.error("Total PayPal (PP) is required.");
      return false;
    }

    if (totalCash === undefined || totalCash === null) {
      toast.error("Total Cash is required.");
      return false;
    }

    if (grandTotal === undefined || grandTotal === null) {
      toast.error("Grand Total is required.");
      return false;
    }

    // Validation successful
    return true;
  };

  const resetForm = () => {
    setRestUpadData(restUpadInitialData);
    setRestPendingData(restPendingInitialData);
    setRestExpensesData(restExpensesInitialData);
    setExtraAmount(0);
    setTotalUpad(0);
    setTotalPending(0);
    setTotalExpenses(0);
    setTotalCard(0);
    setTotalPP(0);
    setTotalCash(0);
    setGrandTotal(0);
    dispatch(getRestEntryByDate(dayjs().format("DD-MM-YYYY")));
  };

  const handleCreateRestEntry = async () => {
    if (!submitEntryValidation()) {
      return; // Stop execution if validation fails
    }

    try {
      dispatch(createRestEntry(restEntryData));
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating the entry."
      );
    }
  };

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
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4.5, xl: 4.5 }}>
          {/* Select Date */}
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
          {/* Upad */}
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
                Upaad
              </Typography>
              <RestUpadTable
                restUpadData={restUpadData}
                setRestUpadData={setRestUpadData}
                selectedDate={selectedDate}
              />
            </Box>
          </Grid>
          {/* Pending */}
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  fontSize: "18px",
                  backgroundColor: "#e5ffe0",
                  margin: "16px 0",
                  padding: "4px 16px",
                  borderRadius: "4px",
                  width: "fit-content",
                }}
              >
                Pending
              </Typography>
              <RestPendingTable
                restPendingData={restPendingData}
                setRestPendingData={setRestPendingData}
                selectedDate={selectedDate}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 7, xl: 7 }}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  fontSize: "18px",
                  backgroundColor: "#ffe1f2",
                  padding: "4px 16px",
                  borderRadius: "4px",
                  width: "fit-content",
                }}
              >
                Expenses
              </Typography>
              <RestExpensesTable
                restExpensesData={restExpensesData}
                setRestExpensesData={setRestExpensesData}
                selectedDate={selectedDate}
                totalExpenses={totalExpenses}
                totalUpad={totalUpad}
                totalPending={totalPending}
                totalCard={totalCard}
                setTotalCard={setTotalCard}
                totalPP={totalPP}
                setTotalPP={setTotalPP}
                totalCash={totalCash}
                setTotalCash={setTotalCash}
                grandTotal={grandTotal}
                extraAmount={extraAmount}
              />
              <Box
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "16px",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={handleCreateRestEntry}
                  // onClick={() => {
                  //   console.log(restEntryData);
                  // }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RestEntryPage;
