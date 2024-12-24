import DropdownCell from "../components/DropdownCell";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DataGrid } from "@mui/x-data-grid";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";

const PendingJamaTable = () => {
  const { unpaidEntries } = useSelector((state) => state.entry);

  const getFullNameList = (date, roomNo) => {
    const filteredEntries = unpaidEntries.filter(
      (entry) => entry.date === date && entry.roomNo === roomNo
    );
    return filteredEntries.map((entry) => entry.fullname);
  };

  const getMobileNoList = (date, roomNo, fullname) => {
    const filteredEntries = unpaidEntries.filter(
      (entry) =>
        entry.date === date &&
        entry.roomNo === roomNo &&
        entry.fullname === fullname
    );
    return filteredEntries.map((entry) => entry.mobileNumber);
  };

  const getRoomNoList = (date) => {
    const filteredEntries = unpaidEntries.filter(
      (entry) => entry.date === date
    );
    return filteredEntries.map((entry) => entry.roomNo);
  };

  const initializePendingJamaRows = () => {
    return Array.from({ length: 10 }, (_, idx) => ({
      id: idx + 1,
      date: "",
      roomNo: 0,
      fullname: "",
      mobileNumber: 0,
      amount: 0,
      modeOfPayment: "",
    }));
  };
  const [pendingJamaRows, setPendingJamaRows] = useState(
    initializePendingJamaRows
  );

  const handleRowEdit = (updatedRow) => {
    setPendingJamaRows((prevRows) =>
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
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      <DataGrid
        rows={pendingJamaRows}
        columns={[
          {
            field: "id",
            headerName: "ID",
            width: 80,
            editable: false,
            cellClassName: "purple",
            headerClassName: "purple",
          },
          {
            field: "date",
            headerName: "Date",
            width: 120,
            editable: true,
            cellClassName: "purple",
            headerClassName: "purple",
            renderEditCell: (params) => (
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb"
              >
                <DatePicker
                  views={["year", "month", "day"]}
                  value={
                    params.value ? dayjs(params.value, "DD-MM-YYYY") : null
                  }
                  className="purple"
                  onChange={(newDate) => {
                    const formattedDate = dayjs(newDate, "DD-MM-YYYY");
                    params.api.setEditCellValue({
                      id: params.id,
                      field: "date",
                      value: formattedDate,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="purple"
                      variant="outlined"
                      size="small"
                      helperText={null}
                    />
                  )}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "24px",
                      fontSize: "14px",
                      color: "white",
                    },
                    "& .MuiIconButton-root": {
                      padding: "0px",
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
                {params.value || "Select Date"}
              </div>
            ),
          },
          {
            field: "roomNo",
            headerName: "Room No",
            width: 120,
            editable: true,
            cellClassName: "purple",
            headerClassName: "purple",
            renderEditCell: (params) => (
              <DropdownCell
                value={params.row.roomNo}
                options={getRoomNoList(params.row.date)}
                onChange={(value) =>
                  handleRowEdit({
                    ...params.row,
                    roomNo: value,
                  })
                }
              />
            ),
          },
          {
            field: "fullname",
            headerName: "Full Name",
            width: 180,
            editable: true,
            cellClassName: "purple",
            headerClassName: "purple",
            renderCell: (params) => (
              <DropdownCell
                value={params.row.fullname}
                options={getFullNameList(
                  dayjs(params.row.date, "DD-MM-YYYY").format("DD-MM-YYYY"),
                  params.row.roomNo
                )}
                onChange={(value) =>
                  handleRowEdit({
                    ...params.row,
                    fullname: value,
                  })
                }
              />
            ),
          },
          {
            field: "mobileNumber",
            headerName: "Mobile No",
            width: 180,
            editable: true,
            cellClassName: "purple",
            headerClassName: "purple",
            renderCell: (params) => (
              <DropdownCell
                value={params.row.mobileNumber}
                options={getMobileNoList(
                  dayjs(params.row.date, "DD-MM-YYYY").format("DD-MM-YYYY"),
                  params.row.roomNo,
                  params.row.fullname
                )}
                onChange={(value) =>
                  handleRowEdit({
                    ...params.row,
                    mobileNumber: value,
                  })
                }
              />
            ),
          },
          {
            field: "amount",
            headerName: "Amount",
            width: 120,
            editable: true,
            cellClassName: "purple",
            headerClassName: "purple",
          },
          {
            field: "modeOfPayment",
            headerName: "Mode of Payment",
            width: 180,
            editable: true,
            cellClassName: "purple",
            headerClassName: "purple",
            renderCell: (params) => (
              <DropdownCell
                value={params.row.modeOfPayment}
                options={["Select", "Card", "PPC", "PPS", "Cash", "UnPaid"]}
                onChange={(value) =>
                  handleRowEdit({
                    ...params.row,
                    modeOfPayment: value,
                  })
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
        onProcessRowUpdateError={(params) => {
          console.error(params);
        }}
        showCellVerticalBorder
        rowHeight={25}
        style={{
          color: "white",
          backgroundColor: "#8b62d5",
        }}
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
            backgroundColor: "#8b62d5",
          },
          "& .MuiDataGrid-row--editing": {
            boxShadow: "none",
          },
          "& .MuiDataGrid-cell--editing": {
            boxShadow: "none",
          },
          ".purple": {
            backgroundColor: "#8b62d5",
          },
          ".purple.purple": {
            backgroundColor: "#8b62d5",
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

export default PendingJamaTable;
