import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, FormControl, Select } from "@mui/material";
import { Refresh } from "@mui/icons-material";

// Utility function to initialize rows
const initializeRows = (rowsLength, roomCosts) => {
  return Array.from({ length: rowsLength }, (_, i) => ({
    id: i + 1,
    roomNo: i + 1,
    cost: roomCosts[i + 1] || 0,
    rate: 0,
    noOfPeople: 0,
    type: "",
    modeOfPayment: "",
    fullname: "",
  }));
};

// Dropdown Cell Renderer
const DropdownCell = ({ value, options, onChange }) => (
  <FormControl size="small" fullWidth>
    <Select
      native
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  </FormControl>
);

const TableComponent = ({ title, rowsLength, roomCosts, onSubmit }) => {
  const [rows, setRows] = useState(initializeRows(rowsLength, roomCosts));

  // Handle row update logic
  const handleRowEdit = (updatedRow) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedRow.id
          ? {
              ...row,
              ...updatedRow,
            }
          : row
      )
    );
  };

  // Reset rows
  const handleReset = () => {
    setRows(initializeRows(rowsLength, roomCosts));
  };

  // Calculate totals
  const totalsRow = {
    id: "totals",
    roomNo: "Totals",
    cost: "",
    rate: "",
    noOfPeople: rows.reduce((sum, row) => sum + row.noOfPeople, 0),
    type: "",
    modeOfPayment: "",
    fullname: "",
  };

  return (
    <div>
      <div className="table-header">
        <Button variant="contained" color="primary" onClick={handleReset}>
          Reset Table <Refresh />
        </Button>
      </div>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={[...rows, totalsRow]}
          columns={[
            {
              field: "roomNo",
              headerName: "Room No",
              width: 100,
              editable: false,
            },
            { field: "cost", headerName: "Cost", width: 100, editable: false },
            {
              field: "rate",
              headerName: "Rate",
              width: 100,
              editable: true,
              type: "number",
            },
            {
              field: "noOfPeople",
              headerName: "People",
              width: 100,
              editable: true,
              type: "number",
            },
            {
              field: "type",
              headerName: "Type",
              width: 150,
              renderCell: (params) => (
                <DropdownCell
                  value={params.row.type}
                  options={[
                    "Single",
                    "Couple",
                    "Family",
                    "Employee",
                    "NRI",
                    "Foreigner",
                    "Other",
                  ]}
                  onChange={(value) =>
                    handleRowEdit({ ...params.row, type: value })
                  }
                />
              ),
            },
            {
              field: "modeOfPayment",
              headerName: "Payment",
              width: 150,
              renderCell: (params) => (
                <DropdownCell
                  value={params.row.modeOfPayment}
                  options={["Card", "Online", "Cash", "UnPaid"]}
                  onChange={(value) =>
                    handleRowEdit({ ...params.row, modeOfPayment: value })
                  }
                />
              ),
            },
            {
              field: "fullname",
              headerName: "Full Name",
              width: 200,
              editable: true,
            },
          ]}
          pageSize={5}
          processRowUpdate={handleRowEdit}
          disableSelectionOnClick
        />
      </div>

      <Button
        variant="contained"
        color="success"
        onClick={() => onSubmit(rows)}
      >
        Submit Table
      </Button>
    </div>
  );
};

export default TableComponent;
