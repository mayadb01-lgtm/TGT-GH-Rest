import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FormControl, Select } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { MobileTimePicker } from "@mui/x-date-pickers";

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
            width: 130,
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
            width: 120,
            editable: true,
            renderEditCell: (params) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={params.value ? dayjs(params.value, "hh:mm A") : null}
                  onChange={(newValue) => {
                    const formattedTime = newValue
                      ? dayjs(newValue).format("hh:mm A")
                      : null;
                    params.api.setEditCellValue({
                      id: params.id,
                      field: "checkInTime",
                      value: formattedTime,
                    });
                  }}
                  renderInput={(props) => (
                    <input
                      {...props}
                      style={{
                        fontSize: "14px",
                        height: "24px",
                        width: "100%",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "4px",
                        outline: "none",
                        backgroundColor: "#fff",
                      }}
                      placeholder="Select Time" // Placeholder text
                    />
                  )}
                  ampm
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "24px",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                />
              </LocalizationProvider>
            ),
            renderCell: (params) => (
              <div
                style={{
                  fontSize: "12px",
                  textAlign: "start",
                  lineHeight: "24px",
                }}
              >
                {params.value || "Check In Time"}
              </div>
            ),
          },
          {
            field: "checkOutTime",
            headerName: "Check Out",
            width: 120,
            editable: true,
            renderEditCell: (params) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={params.value ? dayjs(params.value, "hh:mm A") : null}
                  onChange={(newValue) => {
                    const formattedTime = newValue
                      ? dayjs(newValue).format("hh:mm A")
                      : null;
                    params.api.setEditCellValue({
                      id: params.id,
                      field: "checkOutTime",
                      value: formattedTime,
                    });
                  }}
                  renderInput={(props) => (
                    <input
                      {...props}
                      style={{
                        fontSize: "14px",
                        height: "24px",
                        width: "100%",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "4px",
                        outline: "none",
                        backgroundColor: "#fff",
                      }}
                      placeholder="Select Time" // Placeholder text
                    />
                  )}
                  ampm
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "24px",
                      fontSize: "14px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3f51b5",
                    },
                  }}
                />
              </LocalizationProvider>
            ),
            renderCell: (params) => (
              <div
                style={{
                  fontSize: "12px",
                  textAlign: "start",
                  lineHeight: "24px",
                }}
              >
                {params.value || "Check Out Time"}
              </div>
            ),
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
            fontStyle: "normal",
            fontWeight: "bold",
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
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            justifyContent: "center",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            display: "flex",
            justifyContent: "center",
          },
        }}
        column
      />
    </div>
  );
};

export default TableComponent;
