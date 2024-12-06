import { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TableComponent from "../components/TableComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";

// Utility function to process entries by payment mode
const processEntriesByPaymentMode = (data, mode) => {
  const filteredEntries = data.filter((row) => row.modeOfPayment === mode);

  if (filteredEntries.length > 0) {
    return filteredEntries;
  }

  return [];
};

// Reusable SummaryTable component
const SummaryTable = ({ title, dayRows, nightRows, columns }) => {
  const finalRows = [...dayRows, ...nightRows];

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
      fullWidth
      style={{
        margin: 0,
        padding: 0,
        fontSize: "12px",
      }}
    >
      {/* <Typography
      variant="h6"
      color={getTitleColor(title)}
      fontSize={14}
      fontWeight={500}
      style={{ marginBottom: "8px" }} // Reduce margin below the title
    >
      {title}
    </Typography> */}
      <Stack direction="row" spacing={1} style={{ gap: "8px" }}>
        {" "}
        {/* Compact spacing */}
        <Box style={{ margin: "2px 0", padding: "0", width: "100%" }}>
          {" "}
          {/* Width 50% for side-by-side layout */}
          {/* <Typography
          variant="subtitle2"
          fontWeight={500}
          // style={{ marginBottom: "4px" }} // Compact spacing
        >
          Day Entries
        </Typography> */}
          <DataGrid
            rows={finalRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            style={{
              fontSize: "12px",
              height: "180px",
              width: "100%",
            }}
            rowHeight={25}
            disableColumnMenu
            disableColumnSorting
            sx={{
              "& .MuiDataGrid-columnHeader": {
                maxHeight: "20px",
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

  const handleDaySubmit = (data) => setDayData(data);
  const handleNightSubmit = (data) => setNightData(data);

  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "Day/Night", width: 80 },
    { field: "modeOfPayment", headerName: "Mode", width: 60 },
    { field: "roomNo", headerName: "Room No", width: 80 },
    { field: "rate", headerName: "Rate", width: 60 },
    { field: "fullname", headerName: "Full Name", width: 100 },
    { field: "noOfPeople", headerName: "No. of People", width: 100 },
  ];

  // Processed data by payment mode using memoization for performance
  const cashEntries = useMemo(
    () => ({
      day: processEntriesByPaymentMode(dayData, "Cash"),
      night: processEntriesByPaymentMode(nightData, "Cash"),
    }),
    [dayData, nightData]
  );

  const cardEntries = useMemo(
    () => ({
      day: processEntriesByPaymentMode(dayData, "Card"),
      night: processEntriesByPaymentMode(nightData, "Card"),
    }),
    [dayData, nightData]
  );

  const onlineEntries = useMemo(
    () => ({
      day: processEntriesByPaymentMode(dayData, "Online"),
      night: processEntriesByPaymentMode(nightData, "Online"),
    }),
    [dayData, nightData]
  );

  const unpaidEntries = useMemo(
    () => ({
      day: processEntriesByPaymentMode(dayData, "UnPaid"),
      night: processEntriesByPaymentMode(nightData, "UnPaid"),
    }),
    [dayData, nightData]
  );

  // Columns for Total DataGrid
  const modeColumns = [
    { field: "id", headerName: "Ashirvad", width: 80 },
    { field: "totals", headerName: "Total", width: 60 },
  ];

  const modeRows = [
    { id: "Cash", totals: 0 },
    { id: "Card", totals: 0 },
    { id: "Online", totals: 0 },
    { id: "UnPaid", totals: 0 },
    { id: "Total", totals: 0 },
  ];

  // Calculate totals for each payment mode
  modeRows[0].totals =
    cashEntries.day.reduce((sum, row) => sum + row.rate, 0) +
    cashEntries.night.reduce((sum, row) => sum + row.rate, 0);
  modeRows[1].totals =
    cardEntries.day.reduce((sum, row) => sum + row.rate, 0) +
    cardEntries.night.reduce((sum, row) => sum + row.rate, 0);
  modeRows[2].totals =
    onlineEntries.day.reduce((sum, row) => sum + row.rate, 0) +
    onlineEntries.night.reduce((sum, row) => sum + row.rate, 0);
  modeRows[3].totals =
    unpaidEntries.day.reduce((sum, row) => sum + row.rate, 0) +
    unpaidEntries.night.reduce((sum, row) => sum + row.rate, 0);
  modeRows[4].totals =
    modeRows[0].totals +
    modeRows[1].totals +
    modeRows[2].totals +
    modeRows[3].totals;

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justifyContent="center"
      alignItems="start"
    >
      {/* Left Side: Day and Night Entry Tables */}
      <Grid size={{ xs: 12, sm: 4.8, md: 4.8, lg: 4.8, xl: 4.8 }}>
        <Box>
          {/* Day Entries */}
          <Accordion defaultExpanded style={{ margin: "0", paddingBlock: "0" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="day-entries-content"
              id="day-entries-header"
              style={{
                backgroundColor: "#f6f6f6",
                borderBottom: "1px solid #e0e0e0",
                margin: "0",
                padding: "0 18px",
                minHeight: "0",
                height: "30px",
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
                    fontSize: "12px",
                  }}
                >
                  Day Entries
                </Typography>

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 500,
                    fontSize: "12px",
                  }}
                >
                  Aashirvad Guest House
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails style={{ margin: "0", paddingBlock: "0" }}>
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
          <Accordion defaultExpanded style={{ margin: "0", paddingBlock: "0" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="night-entries-content"
              id="night-entries-header"
              style={{
                backgroundColor: "#f6f6f6",
                borderBottom: "1px solid #e0e0e0",
                margin: "0",
                padding: "0 18px",
                minHeight: "0",
                height: "30px",
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
                    fontSize: "12px", // Smaller font size
                  }}
                >
                  Night Entries
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    fontSize: "12px", // Smaller font size
                  }}
                >
                  Aashirvad Guest House
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails style={{ margin: "0", paddingBlock: "0" }}>
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

      {/* Middle Side: Summaries */}
      <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
        <Box>
          <Stack direction="column" spacing={0.5} sx={{ padding: "0 8px" }}>
            <SummaryTable
              title="Cash Entries Summary"
              dayRows={cashEntries.day}
              nightRows={cashEntries.night}
              columns={columns}
            />
            <SummaryTable
              title="Card Entries Summary"
              dayRows={cardEntries.day}
              nightRows={cardEntries.night}
              columns={columns}
            />
            <SummaryTable
              title="Online Entries Summary"
              dayRows={onlineEntries.day}
              nightRows={onlineEntries.night}
              columns={columns}
            />
            <SummaryTable
              title="UnPaid Entries Summary"
              dayRows={unpaidEntries.day}
              nightRows={unpaidEntries.night}
              columns={columns}
            />
          </Stack>
        </Box>
      </Grid>

      {/* Right - Totals Calculations DataGrids */}
      <Grid size={{ xs: 12, sm: 3.2, md: 3.2, lg: 3.2, xl: 3.2 }}>
        <Box>
          <Typography
            variant="h6"
            color="primary"
            fontSize={14}
            fontWeight={500}
            style={{ marginBottom: "8px" }}
          >
            Totals
          </Typography>
          <Stack direction="row" spacing={1} style={{ gap: "8px" }}>
            <Box style={{ margin: 0, padding: 0, width: "100%" }}>
              <Typography
                variant="subtitle2"
                fontWeight={500}
                style={{ marginBottom: "4px" }}
              >
                Day Entries
              </Typography>
              <DataGrid
                rows={modeRows}
                columns={modeColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                style={{
                  fontSize: "12px",
                  height: "250px",
                  width: "100%",
                }}
                rowHeight={25}
                disableColumnMenu
                disableColumnSorting
                sx={{
                  "& .MuiDataGrid-columnHeader": {
                    maxHeight: "20px",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    display: "none",
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default EntryPage;
