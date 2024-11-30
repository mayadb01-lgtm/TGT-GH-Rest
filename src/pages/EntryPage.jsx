import { useState } from "react";
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

const EntryPage = () => {
  const [dayData, setDayData] = useState([]);
  const [nightData, setNightData] = useState([]);

  const handleDaySubmit = (data) => {
    setDayData(data);
    console.log("Day Data Submitted:", data);
  };

  const handleNightSubmit = (data) => {
    setNightData(data);
    console.log("Night Data Submitted:", data);
  };

  console.log("Day Data:", dayData);
  console.log("Night Data:", nightData);

  // Day - Calculations
  // 1. Total rate by Payment Mode
  const dayTotalRateByPaymentMode = dayData.reduce((acc, row) => {
    acc[row.modeOfPayment] =
      acc[row.modeOfPayment] + row.totalAmount || row.totalAmount;
    return acc;
  }, {});

  // Total Amount by Payment Mode
  const dayTotalAmountByPaymentMode = Object.values(
    dayTotalRateByPaymentMode
  ).reduce((sum, rate) => sum + rate, 0);

  // Night - Calculations
  // 1. Total rate by Payment Mode
  const nightTotalRateByPaymentMode = nightData.reduce((acc, row) => {
    acc[row.modeOfPayment] =
      acc[row.modeOfPayment] + row.totalAmount || row.totalAmount;
    return acc;
  }, {});

  // Total Amount by Payment Mode
  const nightTotalAmountByPaymentMode = Object.values(
    nightTotalRateByPaymentMode
  ).reduce((sum, rate) => sum + rate, 0);

  return (
    <Grid container spacing={2} style={{ margin: "auto", width: "95%" }}>
      {/* Left Side: Day and Night Entry Tables */}
      <Grid item xs={12} md={7}>
        <Box sx={{ padding: "24px" }}>
          {/* Day Entries Section with Accordion */}
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

          {/* Night Entries Section with Accordion */}
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
      <Grid item xs={12} md={5}>
        <div style={{ marginBottom: "32px" }}>
          <h3>Summary of Day Entries</h3>
          <div style={{ height: "100%", width: "50%" }}>
            <DataGrid
              rows={[
                {
                  id: 1,
                  modeOfPayment: "Cash",
                  totalAmount: dayTotalAmountByPaymentMode["Cash"] || 0,
                },
                {
                  id: 2,
                  modeOfPayment: "Card",
                  totalAmount: dayTotalAmountByPaymentMode["Card"] || 0,
                },
                {
                  id: 3,
                  modeOfPayment: "UPI",
                  totalAmount: dayTotalAmountByPaymentMode["Online"] || 0,
                },
                {
                  id: 4,
                  modeOfPayment: "Others",
                  totalAmount: dayTotalAmountByPaymentMode["UnPaid"] || 0,
                },
              ]}
              columns={[
                {
                  field: "modeOfPayment",
                  headerName: "Payment Mode",
                  width: 200,
                },
                {
                  field: "totalAmount",
                  headerName: "Total Amount",
                  width: 200,
                },
              ]}
              pageSize={4}
            />
          </div>
        </div>
        <div style={{ marginBottom: "32px" }}>
          <h3>Summary of Night Entries</h3>
          <div style={{ height: "100%", width: "50%" }}>
            <DataGrid
              rows={[
                {
                  id: 1,
                  modeOfPayment: "Cash",
                  totalAmount: nightTotalAmountByPaymentMode["Cash"] || 0,
                },
                {
                  id: 2,
                  modeOfPayment: "Card",
                  totalAmount: nightTotalAmountByPaymentMode["Card"] || 0,
                },
                {
                  id: 3,
                  modeOfPayment: "UPI",
                  totalAmount: nightTotalAmountByPaymentMode["Online"] || 0,
                },
                {
                  id: 4,
                  modeOfPayment: "Others",
                  totalAmount: nightTotalAmountByPaymentMode["UnPaid"] || 0,
                },
              ]}
              columns={[
                {
                  field: "modeOfPayment",
                  headerName: "Payment Mode",
                  width: 200,
                },
                {
                  field: "totalAmount",
                  headerName: "Total Amount",
                  width: 200,
                },
              ]}
              pageSize={4}
            />
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default EntryPage;
