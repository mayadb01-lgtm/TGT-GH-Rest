import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RestUpadTable from "../../components/restaurant/RestUpadTable";
import RestExpensesTable from "../../components/restaurant/RestExpensesTable";
import RestPendingTable from "../../components/restaurant/RestPendingTable";
dayjs.locale("en-gb");

const RestEntryPage = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  // Upad
  const restUpadInitialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    amount: 0,
    fullname: "",
    mobileNumber: "",
  }));
  const [restUpadData, setRestUpadData] = useState(restUpadInitialData);
  // Pending
  const restPendingInitialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    fullname: "",
    mobileNumber: "",
    amount: 0,
  }));
  const [restPendingData, setRestPendingData] = useState(
    restPendingInitialData
  );
  // Expenses
  const restExpensesInitialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    amount: 0,
    fullname: "",
    mobileNumber: "",
    category: 0,
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

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate.format("DD-MM-YYYY"));
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
