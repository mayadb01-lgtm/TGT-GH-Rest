import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
dayjs.locale("en-gb");
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { formatChartData } from "../charts/chartUtils";
import LineChartComponent from "../charts/LineChartComponent";
import PieChartComponent from "../charts/PieChartComponent";
import { getOfficeBookByDateRange } from "../../redux/actions/officeBookAction";
import { GH_MODE_OF_PAYMENT_OPTIONS } from "../../utils/utils";
import { getEntriesByDateRange } from "../../redux/actions/entryAction";
import { getRestEntriesByDateRange } from "../../redux/actions/restEntryAction";

const OfficeMergedGraph = () => {
  const dispatch = useAppDispatch();
  const { loading: ghLoading, entries } = useAppSelector(
    (state) => state.entry
  );
  const { loading: restLoading, restEntries } = useAppSelector(
    (state) => state.restEntry
  );
  const { loading: officeLoading, officeBook } = useAppSelector(
    (state) => state.officeBook
  );
  const formatDate = (date) =>
    dayjs(date, ["DD-MM-YYYY", "YYYY-MM-DD", "MM-DD-YYYY"]).format(
      "DD-MM-YYYY"
    );
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(
          getOfficeBookByDateRange(
            startDate.format("DD-MM-YYYY"),
            endDate.format("DD-MM-YYYY")
          )
        );
        await dispatch(
          getEntriesByDateRange(
            startDate.format("DD-MM-YYYY"),
            endDate.format("DD-MM-YYYY")
          )
        );
        await dispatch(
          getRestEntriesByDateRange(
            startDate.format("DD-MM-YYYY"),
            endDate.format("DD-MM-YYYY")
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, startDate, endDate]);

  const handleStartDateChange = useCallback(
    (newDate) => newDate && setStartDate(newDate),
    []
  );
  const handleEndDateChange = useCallback(
    (newDate) => newDate && setEndDate(newDate),
    []
  );

  // Prepare - Chart 1 data = Total Sales of GH + Rest + OfficeIn

  const ghSalesTotal =
    (entries &&
      entries.length > 0 &&
      entries
        ?.map((entry) =>
          entry?.entry
            ?.filter(
              (item) =>
                GH_MODE_OF_PAYMENT_OPTIONS.includes(item.modeOfPayment) &&
                item.period !== "UnPaid"
            )
            .map((item) => item.rate)
            .reduce((a, b) => a + b, 0)
        )
        .reduce((a, b) => a + b, 0)) ||
    0;

  const restSalesTotal =
    (restEntries &&
      restEntries.reduce((total, entry) => total + entry.grandTotal, 0)) ||
    0;

  const officeInSalesTotal =
    officeBook
      ?.flatMap((entry) => (entry.officeIn ? entry.officeIn : []))
      ?.filter((entry) => entry.categoryName !== "Banquet")
      .reduce((total, entry) => total + entry.amount, 0) || 0;

  const officeInCategoryBenquetTotal =
    officeBook
      ?.flatMap((entry) => (entry.officeIn ? entry.officeIn : []))
      ?.filter((entry) => entry.categoryName === "Banquet")
      ?.reduce((total, entry) => total + entry.amount, 0) || 0;

  const pieChartTotalMergedSalesData = useMemo(
    () => [
      { name: "GH Sales", value: ghSalesTotal },
      { name: "Rest Sales", value: restSalesTotal },
      { name: "Office Sales", value: officeInSalesTotal },
      { name: "Banquet", value: officeInCategoryBenquetTotal },
    ],
    [
      ghSalesTotal,
      restSalesTotal,
      officeInSalesTotal,
      officeInCategoryBenquetTotal,
    ]
  );

  const totalMergedSalesAmount =
    ghSalesTotal +
    restSalesTotal +
    officeInSalesTotal +
    officeInCategoryBenquetTotal;

  const chartBoxStyle = {
    width: "100%",
    height: isFullScreen ? "80vh" : { xs: "320px", sm: "550px" },
    bgcolor: "#fff",
    borderRadius: 3,
    boxShadow: 3,
    p: 3,
  };

  return (
    <Box sx={{ px: 2, py: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
        🏢 Merged Graph
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        mb={3}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            format="DD-MM-YYYY"
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            format="DD-MM-YYYY"
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>
        <FormControlLabel
          control={
            <Checkbox
              checked={isFullScreen}
              onChange={() => setIsFullScreen((prev) => !prev)}
            />
          }
          label="Full Screen Graph"
        />
      </Stack>

      {ghLoading || restLoading || officeLoading ? (
        <Stack alignItems="center" mt={4}>
          <CircularProgress />
        </Stack>
      ) : officeBook.length === 0 ? (
        <Typography textAlign="center" mt={4}>
          No data available for selected range
        </Typography>
      ) : (
        <Grid
          container
          sx={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          width={"100%"}
        >
          <Stack
            direction={isFullScreen ? "column" : "row"}
            spacing={2}
            alignItems="center"
            mb={2}
            display="flex"
            width={"100%"}
          >
            {/* Pie Chart - Expenses */}
            <Grid item xs={12} md={12} sx={chartBoxStyle}>
              <Box width="90%" height="90%">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    gutterBottom
                    color="primary"
                  >
                    Sales - GH+Rest+OfficeIn
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    gutterBottom
                    color="primary"
                  >
                    Total Spent: ₹{totalMergedSalesAmount.toFixed(2)}
                  </Typography>
                </Stack>
                {pieChartTotalMergedSalesData.length === 0 ? (
                  <Typography>No expense data available</Typography>
                ) : (
                  <PieChartComponent
                    data={pieChartTotalMergedSalesData}
                    isFullScreen={isFullScreen}
                  />
                )}
              </Box>
            </Grid>

            {/* Pie Chart - Office In and Out */}
            {/* <Grid item xs={12} md={12} sx={chartBoxStyle}>
              <Box width="90%" height="90%">
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    gutterBottom
                    color="primary"
                  >
                    🏠 Office Category Out
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    gutterBottom
                    color="primary"
                  >
                    Total Spent: ₹
                    {totalOfficeCategoryExpensesOutAmount.toFixed(2)}
                  </Typography>
                </Stack>
                {pieChartOfficeCategoryExpensesOutData.length === 0 ? (
                  <Typography>No expense data available</Typography>
                ) : (
                  <PieChartComponent
                    data={pieChartOfficeCategoryExpensesOutData}
                    isFullScreen={isFullScreen}
                  />
                )}
              </Box>
            </Grid> */}
          </Stack>
        </Grid>
      )}
    </Box>
  );
};

export default OfficeMergedGraph;
