import { useState } from "react";
import { Typography, Box, Divider } from "@mui/material";
import TableComponent from "../components/TableComponent";

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

  return (
    <Box sx={{ padding: "24px" }}>
      {/* Day Entries Section */}
      <Typography variant="h4" gutterBottom>
        Day Entries
      </Typography>
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

      <Divider sx={{ my: 4 }} />

      {/* Night Entries Section */}
      <Typography variant="h4" gutterBottom>
        Night Entries
      </Typography>
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
    </Box>
  );
};

export default EntryPage;
