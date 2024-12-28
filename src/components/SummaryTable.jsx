import { DataGrid } from "@mui/x-data-grid";
import { Box, Stack, Typography } from "@mui/material";

const SummaryTable = ({
  title,
  dayRows,
  nightRows,
  extraDayRows,
  extraNightRows,
  pendingJamaCash,
  pendingJamaCard,
  pendingJamaPPS,
  pendingJamaPPC,
  columns,
  color,
}) => {
  const finalRows = [
    ...(dayRows || []),
    ...(nightRows || []),
    ...(extraDayRows || []),
    ...(extraNightRows || []),
    ...(pendingJamaCash || []),
    ...(pendingJamaCard || []),
    ...(pendingJamaPPS || []),
    ...(pendingJamaPPC || []),
  ].filter((row) => row.rate !== 0);

  if (finalRows.length > 0) {
    finalRows[finalRows.length] = {
      id: `Total ${title}`,
      roomNo: "",
      rate: finalRows.reduce((sum, row) => sum + row.rate, 0),
      fullname: "",
      noOfPeople: "",
    };
  }

  return (
    <Box
      style={{
        margin: 0,
        padding: 0,
        fontSize: "12px",
      }}
    >
      <Stack direction="row" spacing={1} style={{ gap: "8px" }}>
        {" "}
        {/* Compact spacing */}
        <Box style={{ margin: "2px 0", padding: "0", width: "100%" }}>
          {" "}
          {/* Width 50% for side-by-side layout */}
          <Typography
            variant="subtitle2"
            fontWeight={500}
            style={{
              marginBottom: "4px",
              padding: "4px",
            }}
          >
            {title}
          </Typography>
          <DataGrid
            rows={finalRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            style={{
              fontSize: "12px",
              height: "220px",
              width: "100%",
              backgroundColor: color,
              color: "white",
            }}
            rowHeight={25}
            disableColumnMenu
            disableColumnSorting
            showColumnVerticalBorder
            disableColumnResize
            sx={{
              "& .MuiDataGrid-columnHeader": {
                maxHeight: "25px",
                backgroundColor: color,
              },
              "& .MuiDataGrid-footerContainer": {
                display: "none",
              },
              "& .MuiDataGrid-scrollbar": {
                display: "none",
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default SummaryTable;
