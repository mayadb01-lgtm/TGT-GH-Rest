import { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import TableComponent from "../components/TableComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";

// Utility function to process entries by payment mode
const processEntriesByPaymentMode = (data, mode) => {
  const filteredEntries = data.filter((row) => row.modeOfPayment === mode);
  const totalAmount = filteredEntries.reduce(
    (total, row) => total + row.totalAmount,
    0
  );
  if (totalAmount === 0) return [];
  return [
    ...filteredEntries,
    {
      id: "",
      roomNo: "",
      fullname: `Total ${mode} Amount`,
      totalAmount,
    },
  ];
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
      margin="16px 0"
    >
      {title}
    </Typography>
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5, 10, 20]}
      autoHeight
    />
    {title.includes("Night") && (
      <Divider
        style={{
          margin: "16px 0",
          backgroundColor: "#000",
        }}
      />
    )}
  </div>
);

const EntryPage = () => {
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);

  const handleDaySubmit = (data) => setDayData(data);
  const handleNightSubmit = (data) => setNightData(data);

  // Columns for DataGrid
  const columns = [
    { field: "roomNo", headerName: "Room No", width: 120 },
    { field: "fullname", headerName: "Full Name", width: 200 },
    { field: "noOfPeople", headerName: "No. of People", width: 150 },
    { field: "rate", headerName: "Rate", width: 150 },
    { field: "totalAmount", headerName: "Amount", width: 150 },
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
    <Grid container spacing={2} sx={{ margin: "auto", width: "100%" }}>
      {/* Left Side: Day and Night Entry Tables */}
      <Grid item xs={12} md={7}>
        <Box sx={{ padding: "24px" }}>
          {/* Day Entries */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="day-entries-content"
              id="day-entries-header"
            >
              <Typography variant="h4">Day Entries</Typography>
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

          <Divider sx={{ my: 4 }} />

          {/* Night Entries */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="night-entries-content"
              id="night-entries-header"
            >
              <Typography variant="h4">Night Entries</Typography>
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

      {/* Right Side: Summary Tables */}
      {/* Right Side: Summary Tables */}
      <Grid item xs={12} md={5}>
        <Box sx={{ padding: "16px" }}>
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
        </Box>
      </Grid>
    </Grid>
  );
};

export default EntryPage;
