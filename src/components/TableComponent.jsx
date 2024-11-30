import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, FormControl, Select } from "@mui/material";

const TableComponent = ({ title, rowsLength, roomCosts, onSubmit }) => {
  const [rows, setRows] = useState(
    Array.from({ length: rowsLength }, (_, i) => ({
      id: i + 1,
      roomNo: i + 1,
      cost: roomCosts[i + 1],
      rate: 0,
      noOfPeople: 0,
      totalAmount: 0,
      type: "",
      modeOfPayment: "",
    }))
  );

  // Handle inline row updates
  const handleRowEdit = (updatedRow) => {
    const updatedRows = rows.map((row) =>
      row.id === updatedRow.id ? { ...row, ...updatedRow } : row
    );

    // Update totalAmount for the updated row
    const updatedRowsWithTotal = updatedRows.map((row) => ({
      ...row,
      totalAmount: row.rate * row.noOfPeople,
    }));

    setRows(updatedRowsWithTotal);
  };

  const totalAmount = rows.reduce((sum, row) => sum + row.totalAmount, 0);

  // Create the Totals row
  const totalsRow = {
    id: "totals",
    roomNo: "Totals",
    cost: "", // Not editable
    rate: "", // Not editable
    noOfPeople: rows.reduce((sum, row) => sum + row.noOfPeople, 0),
    totalAmount: totalAmount, // Calculate totalAmount
    type: "", // Not editable
    modeOfPayment: "", // Not editable
  };

  // Include the totals row in the rows
  const rowsWithTotals = [...rows, totalsRow];

  return (
    <div style={{ marginBottom: "32px" }}>
      <h3>{title}</h3>
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rowsWithTotals}
          columns={[
            {
              field: "roomNo",
              headerName: "Room No",
              width: 120,
              editable: false, // Read-only column
              type: "number",
            },
            {
              field: "cost",
              headerName: "Cost",
              width: 120,
              editable: false, // Read-only column
              type: "number",
            },
            {
              field: "rate",
              headerName: "Rate",
              width: 120,
              editable: true, // Editable column
              type: "number",
            },
            {
              field: "noOfPeople",
              headerName: "People",
              width: 120,
              editable: true, // Editable column
              type: "number",
            },
            {
              field: "totalAmount",
              headerName: "Total Amount",
              width: 150,
              editable: false, // Read-only column
              type: "number",
            },
            {
              field: "type",
              headerName: "Type",
              width: 150,
              editable: true, // Editable column with dropdown
              renderCell: (params) => (
                <FormControl size="small">
                  <Select
                    variant="outlined"
                    native
                    value={params.row.type}
                    onChange={(e) =>
                      handleRowEdit({
                        ...params.row,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="Single">Single</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Employee">Employee</option>
                    <option value="NRI">NRI</option>
                    <option value="Foreigner">Foreigner</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
              ),
            },
            {
              field: "modeOfPayment",
              headerName: "Payment",
              width: 150,
              editable: true, // Editable column with dropdown
              renderCell: (params) => (
                <FormControl size="small">
                  <Select
                    variant="outlined"
                    native
                    value={params.row.modeOfPayment}
                    onChange={(e) =>
                      handleRowEdit({
                        ...params.row,
                        modeOfPayment: e.target.value,
                      })
                    }
                  >
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                    <option value="Cash">Cash</option>
                    <option value="UnPaid">UnPaid</option>
                  </Select>
                </FormControl>
              ),
            },
          ]}
          pageSize={5}
          processRowUpdate={handleRowEdit} // Handles inline editing for numeric values
        />
      </div>
      <Button
        variant="contained"
        color="success"
        onClick={() => onSubmit(rows)}
        style={{ marginTop: "16px" }}
      >
        Submit Table
      </Button>
    </div>
  );
};

export default TableComponent;
