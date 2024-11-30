import { useState } from "react";
import {
  Typography,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import TableComponent from "../components/TableComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  );
};

export default EntryPage;
