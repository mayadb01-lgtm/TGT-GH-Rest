import { Box, Typography } from "@mui/material";

const CalculationSummary = ({ entries }) => {
  // Calculate total cost
  // const totalCost = entries.reduce((sum, entry) => sum + (entry.cost || 0), 0);

  // Calculate total number of people
  // const totalPeople = entries.reduce((sum, entry) => sum + (entry.noOfPeople || 0), 0);

  return (
    <Box mt={2} p={2} border="1px solid #ddd" borderRadius={4}>
      <Typography variant="h6">Summary</Typography>
      {/* <Typography variant="body1">Total Cost: ₹{totalCost}</Typography>
      <Typography variant="body1">Total People: {totalPeople}</Typography> */}
    </Box>
  );
};

export default CalculationSummary;
