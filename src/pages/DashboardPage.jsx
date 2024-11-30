import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    dayEntries: [],
    nightEntries: [],
  });
  const [date, setDate] = useState("");

  useEffect(() => {
    // Load stored data from localStorage (for now, assuming it's saved during submission)
    const dayEntries = JSON.parse(localStorage.getItem("dayEntries")) || [];
    const nightEntries = JSON.parse(localStorage.getItem("nightEntries")) || [];
    setDashboardData({ dayEntries, nightEntries });
  }, [date]);

  const totalDay = dashboardData.dayEntries.reduce(
    (sum, row) => sum + (row.cost || 0),
    0
  );
  const totalNight = dashboardData.nightEntries.reduce(
    (sum, row) => sum + (row.cost || 0),
    0
  );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <TextField
        label="Select Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Typography variant="h5" mt={4}>
        Day Entries
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room No</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>People</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Payment Mode</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dashboardData.dayEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.roomNo}</TableCell>
              <TableCell>{entry.cost}</TableCell>
              <TableCell>{entry.rate}</TableCell>
              <TableCell>{entry.noOfPeople}</TableCell>
              <TableCell>{entry.type}</TableCell>
              <TableCell>{entry.modeOfPayment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" mt={2}>
        Total (Day): ₹{totalDay}
      </Typography>

      <Typography variant="h5" mt={4}>
        Night Entries
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room No</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>People</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Payment Mode</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dashboardData.nightEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.roomNo}</TableCell>
              <TableCell>{entry.cost}</TableCell>
              <TableCell>{entry.rate}</TableCell>
              <TableCell>{entry.noOfPeople}</TableCell>
              <TableCell>{entry.type}</TableCell>
              <TableCell>{entry.modeOfPayment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" mt={2}>
        Total (Night): ₹{totalNight}
      </Typography>
      <Typography variant="h5" mt={4}>
        Final Total: ₹{totalDay + totalNight}
      </Typography>
    </Box>
  );
};

export default DashboardPage;
