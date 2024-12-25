import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import { getEntriesByDate } from "../redux/actions/entryAction";
import DropdownCell from "./DropdownCell";

const initializeRows = (period, rowsLength, roomCosts) => {
  return Array.from({ length: rowsLength }, (_, i) => ({
    id: `${period} - ${i + 1}`,
    roomNo: i + 1,
    cost: roomCosts[i + 1] || 0,
    rate: 0,
    noOfPeople: 0,
    type: "",
    modeOfPayment: "",
    fullname: `${period} - ${i + 1} Name`,
    mobileNumber: 1234567890,
    checkInTime: "11:00 AM",
    checkOutTime: "10:00 AM",
    period: period,
    createDate: "",
  }));
};

const TableComponent = ({
  title,
  period,
  rowsLength,
  roomCosts,
  onSubmit,
  selectedDate,
}) => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);
  const { entries } = useSelector((state) => state.entry);
  const dispatch = useDispatch();

  const [rows, setRows] = useState(
    initializeRows(period, rowsLength, roomCosts)
  );
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

  useEffect(() => {
    if (selectedDate && isAdminAuthenticated) {
      dispatch(getEntriesByDate(selectedDate));
    }
  }, [selectedDate, isAdminAuthenticated, dispatch]);

  useEffect(() => {
    if (
      selectedDate &&
      isAdminAuthenticated &&
      entries.length > 0 &&
      rows.length > 0 &&
      selectedDate !== dayjs().format("DD-MM-YYYY")
    ) {
      const dayEntries = entries.filter((entry) => entry.period === "day");
      const nightEntries = entries.filter((entry) => entry.period === "night");
      const extraDayEntries = entries.filter(
        (entry) => entry.period === "extraDay"
      );
      const extraNightEntries = entries.filter(
        (entry) => entry.period === "extraNight"
      );

      // Update rows with entries
      const updatedDayEntries = rows.map((row) => {
        const entry = dayEntries.find((entry) => entry.roomNo === row.roomNo);
        if (entry) {
          return {
            ...row,
            id: entry.id,
            cost: entry.cost,
            rate: entry.rate,
            noOfPeople: entry.noOfPeople,
            type: entry.type,
            modeOfPayment: entry.modeOfPayment,
            fullname: entry.fullname,
            mobileNumber: entry.mobileNumber,
            checkInTime: entry.checkInTime,
            checkOutTime: entry.checkOutTime,
          };
        }
        return row;
      });

      const updatedNightEntries = rows.map((row) => {
        const entry = nightEntries.find((entry) => entry.roomNo === row.roomNo);
        if (entry) {
          return {
            ...row,
            id: entry.id,
            cost: entry.cost,
            rate: entry.rate,
            noOfPeople: entry.noOfPeople,
            type: entry.type,
            modeOfPayment: entry.modeOfPayment,
            fullname: entry.fullname,
            mobileNumber: entry.mobileNumber,
            checkInTime: entry.checkInTime,
            checkOutTime: entry.checkOutTime,
          };
        }
        return row;
      });

      const updatedExtraDayEntries = rows.map((row) => {
        const entry = extraDayEntries.find(
          (entry) => entry.roomNo === row.roomNo
        );
        if (entry) {
          return {
            ...row,
            id: entry.id,
            cost: entry.cost,
            rate: entry.rate,
            noOfPeople: entry.noOfPeople,
            type: entry.type,
            modeOfPayment: entry.modeOfPayment,
            fullname: entry.fullname,
            mobileNumber: entry.mobileNumber,
            checkInTime: entry.checkInTime,
            checkOutTime: entry.checkOutTime,
          };
        }
        return row;
      });

      const updatedExtraNightEntries = rows.map((row) => {
        const entry = extraNightEntries.find(
          (entry) => entry.roomNo === row.roomNo
        );
        if (entry) {
          return {
            ...row,
            id: entry.id,
            cost: entry.cost,
            rate: entry.rate,
            noOfPeople: entry.noOfPeople,
            type: entry.type,
            modeOfPayment: entry.modeOfPayment,
            fullname: entry.fullname,
            mobileNumber: entry.mobileNumber,
            checkInTime: entry.checkInTime,
            checkOutTime: entry.checkOutTime,
          };
        }
        return row;
      });

      const dayRows = updatedDayEntries.map((entry) => ({
        id: entry.id,
        roomNo: entry.roomNo,
        cost: entry.cost,
        rate: entry.rate,
        noOfPeople: entry.noOfPeople,
        type: entry.type,
        modeOfPayment: entry.modeOfPayment,
        fullname: entry.fullname,
        mobileNumber: entry.mobileNumber,
        checkInTime: entry.checkInTime,
        checkOutTime: entry.checkOutTime,
      }));

      const nightRows = updatedNightEntries.map((entry) => ({
        id: entry.id,
        roomNo: entry.roomNo,
        cost: entry.cost,
        rate: entry.rate,
        noOfPeople: entry.noOfPeople,
        type: entry.type,
        modeOfPayment: entry.modeOfPayment,
        fullname: entry.fullname,
        mobileNumber: entry.mobileNumber,
        checkInTime: entry.checkInTime,
        checkOutTime: entry.checkOutTime,
      }));

      const extraDayRows = updatedExtraDayEntries.map((entry) => ({
        id: entry.id,
        roomNo: entry.roomNo,
        cost: entry.cost,
        rate: entry.rate,
        noOfPeople: entry.noOfPeople,
        type: entry.type,
        modeOfPayment: entry.modeOfPayment,
        fullname: entry.fullname,
        mobileNumber: entry.mobileNumber,
        checkInTime: entry.checkInTime,
        checkOutTime: entry.checkOutTime,
      }));

      const extraNightRows = updatedExtraNightEntries.map((entry) => ({
        id: entry.id,
        roomNo: entry.roomNo,
        cost: entry.cost,
        rate: entry.rate,
        noOfPeople: entry.noOfPeople,
        type: entry.type,
        modeOfPayment: entry.modeOfPayment,
        fullname: entry.fullname,
        mobileNumber: entry.mobileNumber,
        checkInTime: entry.checkInTime,
        checkOutTime: entry.checkOutTime,
      }));

      if (period.toLowerCase() === "day") {
        setRows(dayRows);
      } else if (period.toLowerCase() === "night") {
        setRows(nightRows);
      } else if (period.toLowerCase() === "extraday") {
        setRows(extraDayRows);
      } else if (period.toLowerCase() === "extranight") {
        setRows(extraNightRows);
      }
    } else {
      setRows(initializeRows(period, rowsLength, roomCosts));
    }
  }, [entries, selectedDate, isAdminAuthenticated]);

  // console.log("Table Component Rows: ", rows);

  const totalsRow = {
    id: `${period}-totals`,
    roomNo: "Totals",
    cost: "",
    rate: rows?.reduce((sum, row) => sum + row.rate, 0),
    noOfPeople: rows?.reduce((sum, row) => sum + row.noOfPeople, 0),
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
            width: 80,
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
                options={["Select", "Card", "PPC", "PPS", "Cash", "UnPaid"]}
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
        style={{
          color: "white",
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
