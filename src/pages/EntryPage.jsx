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
    return [
      ...filteredEntries,
      {
        id: "",
        roomNo: "",
        fullname: `Total ${mode} Amount`,
      },
    ];
  }

  return [];
};

// Utility function to determine title color
const getTitleColor = (title) => {
  if (title.includes("Cash")) return "primary";
  if (title.includes("Card")) return "secondary";
  if (title.includes("Online")) return "success";
  return "error";
};

// Reusable SummaryTable component
const SummaryTable = ({ title, dayRows, nightRows, columns }) => (
  <div>
    <Typography
      variant="h6"
      color={getTitleColor(title)}
      fontSize={16}
      fontWeight={500}
    >
      {title}
    </Typography>
    <Stack direction={"row"} spacing={2}>
      <Box>
        <Typography variant="subtitle2" fontWeight={500}>
          Day Entries
        </Typography>
        <DataGrid
          rows={dayRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          style={{
            fontSize: "12px",
            height: "calc(100% - 16px)",
            width: "100%",
          }}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight={500}>
          Night Entries
        </Typography>
        <DataGrid
          rows={nightRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          style={{
            fontSize: "12px",
            height: "calc(100% - 16px)",
            width: "100%",
          }}
        />
      </Box>
    </Stack>
  </div>
);

const EntryPage = () => {
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);

  const handleDaySubmit = (data) => setDayData(data);
  const handleNightSubmit = (data) => setNightData(data);

  // Columns for DataGrid
  const columns = [
    { field: "roomNo", headerName: "Room No", width: 100 },
    { field: "rate", headerName: "Rate", width: 100 },
    { field: "fullname", headerName: "Full Name", width: 120 },
    { field: "noOfPeople", headerName: "No. of People", width: 120 },
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

  return (
    <Grid
      container
      columns={{ xs: 12, sm: 7, md: 7, lg: 7, xl: 7 }}
      direction="row"
      justifyContent="center"
      alignItems="start"
      flex={1}
    >
      {/* Left Side: Day and Night Entry Tables */}
      <Grid item xs={12} sm={7} md={7} lg={7} xl={7} flex={0.55}>
        <Box sx={{ padding: "8px" }}>
          {/* Day Entries */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="day-entries-content"
              id="day-entries-header"
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flex={1}
                justifyContent={"space-between"}
              >
                <Typography variant="h6">Day Entries</Typography>
                <Typography variant="h6">Aashirvad Guest House</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <TableComponent
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
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flex={1}
                justifyContent={"space-between"}
              >
                <Typography variant="h6">Night Entries</Typography>
                <Typography variant="h6">Aashirvad Guest House</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <TableComponent
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

      {/* Right Side: Summaries */}
      <Grid item xs={12} sm={5} md={5} lg={5} xl={5} flex={0.45}>
        <Box>
          <Stack direction="column" spacing={2.5} sx={{ padding: "8px" }}>
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
    </Grid>
  );
};

export default EntryPage;
