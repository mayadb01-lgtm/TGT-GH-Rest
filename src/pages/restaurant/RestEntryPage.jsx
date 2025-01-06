import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RestTableComponent from "../../components/restaurant/RestTableComponent";
import RestExpensesTable from "./RestExpensesTable";
dayjs.locale("en-gb");

const RestEntryPage = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );

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
        padding={"8px 16px"}
      >
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5.8, xl: 5.8 }}>
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
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 500, fontSize: "14px" }}
            >
              Upaad
            </Typography>
            <RestTableComponent />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5.8, xl: 5.8 }}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, fontSize: "14px" }}
              >
                Expenses
              </Typography>
              <RestExpensesTable />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default RestEntryPage;
