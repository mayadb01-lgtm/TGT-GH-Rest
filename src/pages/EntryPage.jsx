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
const SummaryTable = ({ title, rows, columns }) => (
  <div>
    <Typography
      variant="h6"
      gutterBottom
      color={getTitleColor(title)}
      fontSize={18}
      fontWeight={600}
    >
      {title}
    </Typography>
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5, 10, 20]}
    />
  </div>
);

const EntryPage = () => {
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);

  const handleDaySubmit = (data) => setDayData(data);
  const handleNightSubmit = (data) => setNightData(data);

  // Columns for DataGrid
  const columns = [
    { field: "roomNo", headerName: "Room No", width: 80 },
    { field: "fullname", headerName: "Full Name", width: 120 },
    { field: "noOfPeople", headerName: "No. of People", width: 100 },
    { field: "rate", headerName: "Rate", width: 80 },
  ];

  // Processed data by payment mode using memoization for performance
  const dayCashEntries = useMemo(
    () => processEntriesByPaymentMode(dayData, "Cash"),
    [dayData]
  );
  const nightCashEntries = useMemo(
    () => processEntriesByPaymentMode(nightData, "Cash"),
    [nightData]
  );
  const dayCardEntries = useMemo(
    () => processEntriesByPaymentMode(dayData, "Card"),
    [dayData]
  );
  const nightCardEntries = useMemo(
    () => processEntriesByPaymentMode(nightData, "Card"),
    [nightData]
  );
  const dayOnlineEntries = useMemo(
    () => processEntriesByPaymentMode(dayData, "Online"),
    [dayData]
  );
  const nightOnlineEntries = useMemo(
    () => processEntriesByPaymentMode(nightData, "Online"),
    [nightData]
  );
  const dayUnPaidEntries = useMemo(
    () => processEntriesByPaymentMode(dayData, "UnPaid"),
    [dayData]
  );
  const nightUnPaidEntries = useMemo(
    () => processEntriesByPaymentMode(nightData, "UnPaid"),
    [nightData]
  );

  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 12 }}
      direction="row"
      justifyContent="center"
      alignItems="start"
    >
      {/* Left Side: Day and Night Entry Tables */}
      <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
        <Box sx={{ padding: "8px" }}>
          {/* Day Entries */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="day-entries-content"
              id="day-entries-header"
            >
              <Typography variant="h5">Day Entries</Typography>
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
              <Typography variant="h5">Night Entries</Typography>
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

      <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
        <Box>
          <Stack direction="row" spacing={2} sx={{ padding: "24px" }}>
            <SummaryTable
              title="Day Cash Entries Summary"
              rows={dayCashEntries}
              columns={columns}
            />
            <SummaryTable
              title="Night Cash Entries Summary"
              rows={nightCashEntries}
              columns={columns}
            />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ padding: "24px" }}>
            <SummaryTable
              title="Day Card Entries Summary"
              rows={dayCardEntries}
              columns={columns}
            />
            <SummaryTable
              title="Night Card Entries Summary"
              rows={nightCardEntries}
              columns={columns}
            />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ padding: "24px" }}>
            <SummaryTable
              title="Day Online Entries Summary"
              rows={dayOnlineEntries}
              columns={columns}
            />
            <SummaryTable
              title="Night Online Entries Summary"
              rows={nightOnlineEntries}
              columns={columns}
            />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ padding: "24px" }}>
            <SummaryTable
              title="Day UnPaid Entries Summary"
              rows={dayUnPaidEntries}
              columns={columns}
            />
            <SummaryTable
              title="Night UnPaid Entries Summary"
              rows={nightUnPaidEntries}
              columns={columns}
            />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default EntryPage;
