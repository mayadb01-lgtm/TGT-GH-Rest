import { useEffect, useState } from "react";
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
    mobileNumber: "",
    checkInTime: "",
    checkOutTime: "",
  }));
};

const paymentColors = {
  Card: "rgb(74,116,106)",
  Online: "rgb(231,213,173)",
  Cash: "rgb(99,186,151)",
  UnPaid: "rgb(234,138,122)",
  Select: "#e0e0e0", // Grey
};

// Dropdown Cell Renderer
const DropdownCell = ({ value, options, onChange }) => (
  <FormControl
    size="small"
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: paymentColors[value],
    }}
  >
    <Select
      native
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      style={{
        fontSize: "12px",
        padding: "0px",
        height: "100%",
        width: "100%",
        lineHeight: "normal",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
      // IconComponent={() => null}
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
          style={{
            color: option === "Select" ? "black" : "white",
            backgroundColor: paymentColors[option] || "black",
          }}
        >
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
  const totalsRow = {
    id: "totals",
    roomNo: "Totals",
    cost: "",
    rate: rows.reduce((sum, row) => sum + row.rate, 0),
    noOfPeople: rows.reduce((sum, row) => sum + row.noOfPeople, 0),
    type: "",
    modeOfPayment: "",
    fullname: "",
    mobileNumber: "",
    checkInTime: "",
    checkOutTime: "",
  };

  useEffect(() => {
    onSubmit(rows);
  }, [onSubmit, rows]);

  return (
    <div style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
      <DataGrid
        rows={[...rows, totalsRow]}
        columns={[
          {
            field: "roomNo",
            headerName: "Room",
            width: 50,
            editable: false,
            type: "number",
            cellClassName: "light-gray",
            headerClassName: "light-gray",
            renderEditCell: (params) => (
              <input
                type="number"
                value={params.value}
                className="light-gray"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value > 0 && value <= 11) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: "roomNo",
                      value: value,
                    });
                  }
                }}
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  outline: "none",
                }}
              />
            ),
          },
          {
            field: "cost",
            headerName: "Price",
            width: 50,
            editable: false,
            type: "number",
            cellClassName: "light-gray",
            headerClassName: "light-gray",
            renderEditCell: (params) => (
              <input
                type="number"
                value={params.value}
                className="light-gray"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: "cost",
                      value: value,
                    });
                  }
                }}
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  outline: "none",
                }}
              />
            ),
          },
          {
            field: "rate",
            headerName: "Rate",
            width: 60,
            editable: true,
            type: "number",
            cellClassName: "orange",
            headerClassName: "orange",
            renderEditCell: (params) => (
              <input
                type="number"
                value={params.value}
                className="orange"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: "rate",
                      value: value,
                    });
                  }
                }}
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  outline: "none",
                }}
              />
            ),
          },

          {
            field: "noOfPeople",
            headerName: "People",
            width: 55,
            editable: true,
            type: "number",
            cellClassName: "orange",
            headerClassName: "orange",
            renderEditCell: (params) => (
              <input
                type="number"
                value={params.value}
                className="orange"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: "noOfPeople",
                      value: value,
                    });
                  }
                }}
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  outline: "none",
                }}
              />
            ),
          },
          {
            field: "checkInTime",
            headerName: "Check In",
            width: 120,
            editable: true,
            cellClassName: "blue",
            headerClassName: "blue",
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
                        fontSize: "12px",
                        height: "24px",
                        textAlign: "center",
                        width: "100%",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px",
                        outline: "none",
                      }}
                      placeholder="Select Time"
                      className="blue"
                    />
                  )}
                  ampm
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "24px",
                      fontSize: "14px",
                      color: "white",
                    },
                    "& .MuiInputBase-root input": {
                      textAlign: "center",
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
            cellClassName: "blue",
            headerClassName: "blue",
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
                        fontSize: "12px",
                        height: "24px",
                        textAlign: "center",
                        width: "100%",
                        border: "none",
                        borderRadius: "6px",
                        padding: "4px",
                        outline: "none",
                      }}
                      placeholder="Select Time"
                      className="blue"
                    />
                  )}
                  ampm
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "24px",
                      fontSize: "14px",
                      color: "white",
                    },
                    "& .MuiInputBase-root input": {
                      textAlign: "center",
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
            width: 100,
            cellClassName: "orange",
            headerClassName: "orange",
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
            width: 100,
            cellClassName: "orange",
            headerClassName: "orange",
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
          {
            field: "fullname",
            headerName: "Full Name",
            width: 150,
            editable: true,
            cellClassName: "blue",
            headerClassName: "blue",
            handleRowEdit: (params) => {
              <input
                type="text"
                value={params.value}
                className="blue"
                onChange={(e) => {
                  const value = e.target.value;
                  params.api.setEditCellValue({
                    id: params.id,
                    field: "fullname",
                    value: value,
                  });
                }}
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  outline: "none",
                }}
              />;
            },
          },
          {
            field: "mobileNumber",
            headerName: "Mobile",
            width: 120,
            editable: true,
            type: "number",
            cellClassName: "blue",
            headerClassName: "blue",
            renderEditCell: (params) => (
              <input
                type="number"
                value={params.value}
                className="blue"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10) {
                    params.api.setEditCellValue({
                      id: params.id,
                      field: "mobileNumber",
                      value: value,
                    });
                  }
                }}
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px",
                  outline: "none",
                }}
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
        onProcessRowUpdateError={(params) => {
          console.error(params);
        }}
        showCellVerticalBorder
        rowHeight={25}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            maxHeight: "25px",
            fontStyle: "normal",
            fontWeight: "bold",
            padding: "0px",
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
            padding: "0px",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            display: "flex",
            justifyContent: "center",
          },
          "& .MuiDataGrid-row--editing": {
            boxShadow: "none",
          },
          "& .MuiDataGrid-cell--editing": {
            boxShadow: "none",
          },
          ".orange": {
            backgroundColor: "rgb(247,180,38)",
            color: "white",
          },
          ".blue": {
            backgroundColor: "rgb(30,97,255)",
            color: "white",
          },
          ".light-gray": {
            backgroundColor: "rgb(164,169,175)",
            color: "white",
          },
          ".green": {
            backgroundColor: "rgb(38,177,76)",
            color: "white",
          },
          "& .orange.orange": {
            backgroundColor: "rgb(247,180,38)",
            color: "white",
          },
          "& .blue.blue": {
            backgroundColor: "rgb(30,97,255)",
            color: "white",
          },
          "& .light-gray.light-gray": {
            backgroundColor: "rgb(164,169,175)",
            color: "white",
          },
          "& .green.green": {
            backgroundColor: "rgb(38,177,76)",
            color: "white",
          },
          "& .MuiFormControl-root": {
            color: "white",
          },
          "& .MuiNativeSelect-select": {
            color: "white",
            // padding: "0px",
          },
          "& .MuiNativeSelect-select select": {
            padding: "0px",
          },
          "& .MuiNativeSelect-select option": {
            color: "black",
          },
        }}
        getRowClassName={(params) => {
          return params.id === "totals" ? "green" : "";
        }}
        getCellClassName={(params) => {
          return params.id === "totals" ? "green" : "";
        }}
        disableColumnResize
      />
    </div>
  );
};

export default TableComponent;
