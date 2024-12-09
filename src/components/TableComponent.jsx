import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FormControl, Select } from "@mui/material";

// Utility function to initialize rows
const initializeRows = (dayOrNight, rowsLength, roomCosts) => {
  return Array.from({ length: rowsLength }, (_, i) => ({
    id: `${dayOrNight} - ${i + 1}`,
    roomNo: i + 1,
    cost: roomCosts[i + 1] || 0,
    rate: 0,
    noOfPeople: 0,
    type: "",
    modeOfPayment: "",
    fullname: "",
    checkInTime: "",
    checkOutTime: "",
  }));
};

// Dropdown Cell Renderer
const DropdownCell = ({ value, options, onChange }) => (
  <FormControl
    size="small"
    style={{
      height: "100%",
      justifyContent: "center",
    }}
  >
    <Select
      native
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      style={{
        fontSize: "12px",
        padding: "2px 8px",
        height: "80%",
        lineHeight: "normal",
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  </FormControl>
);

const TableComponent = ({
  title,
  dayOrNight,
  rowsLength,
  roomCosts,
  onSubmit,
}) => {
  const [rows, setRows] = useState(
    initializeRows(dayOrNight, rowsLength, roomCosts)
  );

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
    checkInTime: "",
    checkOutTime: "",
  };

  return (
    <div style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
      <DataGrid
        rows={[...rows, totalsRow]}
        columns={[
          {
            field: "roomNo",
            headerName: "Room",
            width: 60,
            handleRowEdit: (params) => {
              handleRowEdit(params.row);
            },
            editable: false,
          },
          {
            field: "cost",
            headerName: "Cost",
            width: 60,
            handleRowEdit: (params) => {
              handleRowEdit(params.row);
            },
            editable: false,
          },
          {
            field: "rate",
            headerName: "Rate",
            width: 80,
            editable: true,
            type: "number",
            handleRowEdit: (params) => {
              handleRowEdit(params.row);
            },
          },
          {
            field: "fullname",
            headerName: "Full Name",
            width: 120,
            editable: true,
            handleRowEdit: (params) => {
              handleRowEdit(params.row);
            },
          },
          {
            field: "noOfPeople",
            headerName: "People",
            width: 60,
            editable: true,
            type: "number",
            handleRowEdit: (params) => {
              handleRowEdit(params.row);
            },
          },
          {
            field: "checkInTime",
            headerName: "Check In",
            width: 80,
            editable: true,
            handleRowEdit: (params) => {
              handleRowEdit(params.row);
            },
          },
          {
            field: "checkOutTime",
            headerName: "Check Out",
            width: 80,
            editable: true,
            handleRowEdit: (params) => {
              handleRowEdit(params.row);
            },
          },
          {
            field: "type",
            headerName: "Type",
            width: 120,
            renderCell: (params) => (
              <DropdownCell
                value={params.row.type}
                options={[
                  "Select",
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
            width: 120,
            renderCell: (params) => (
              <DropdownCell
                value={params.row.modeOfPayment}
                options={["Select", "Card", "Online", "Cash", "UnPaid"]}
                onChange={(value) =>
                  handleRowEdit({ ...params.row, modeOfPayment: value })
                }
              />
            ),
          },
        ]}
        editMode="row"
        disableColumnMenu
        disableColumnSorting
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        processRowUpdate={handleRowEdit}
        disableSelectionOnClick
        handleRowEdit={onSubmit(rows)}
        rowHeight={25}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            maxHeight: "25px",
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
          fontSize: "12px",
          "& .MuiDataGrid-scrollbar": {
            display: "none",
          },
          "& .MuiInputBase-input": {
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
};

export default TableComponent;
