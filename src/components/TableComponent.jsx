import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { useSelector } from "react-redux";
import { initializeRows, paymentColors } from "../utils/utils";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import "./TableComponent.css";

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
    if (selectedDate && isAdminAuthenticated && entries.length > 0) {
      // Reset rows to initial state before updating
      let initialRows = initializeRows(period, rowsLength, roomCosts);

      const dayEntries = entries.filter((entry) => entry?.period === "day");
      const nightEntries = entries.filter((entry) => entry?.period === "night");
      const extraDayEntries = entries.filter(
        (entry) => entry?.period === "extraDay"
      );
      const extraNightEntries = entries.filter(
        (entry) => entry?.period === "extraNight"
      );

      const updateRowsWithEntries = (rows, entryList) => {
        return rows.map((row) => {
          const entry = entryList.find((entry) => entry.roomNo === row.roomNo);
          return entry
            ? {
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
                createDate: entry.createDate,
                period: entry.period,
              }
            : row;
        });
      };

      let updatedRows = initialRows;
      if (period.toLowerCase() === "day") {
        updatedRows = updateRowsWithEntries(initialRows, dayEntries);
      } else if (period.toLowerCase() === "night") {
        updatedRows = updateRowsWithEntries(initialRows, nightEntries);
      } else if (period.toLowerCase() === "extraday") {
        updatedRows = updateRowsWithEntries(initialRows, extraDayEntries);
      } else if (period.toLowerCase() === "extranight") {
        updatedRows = updateRowsWithEntries(initialRows, extraNightEntries);
      }

      setRows(updatedRows);
    } else {
      setRows(initializeRows(period, rowsLength, roomCosts));
    }
  }, [
    entries,
    selectedDate,
    period,
    rowsLength,
    roomCosts,
    isAdminAuthenticated,
  ]);

  const totalsRow = {
    id: `${period}-totals`,
    roomNo: "Totals",
    cost: "",
    rate: rows?.reduce(
      (sum, row) => sum + (isNaN(row.rate) ? 0 : Number(row.rate)),
      0
    ),
    noOfPeople: rows?.reduce(
      (sum, row) => sum + (isNaN(row.noOfPeople) ? 0 : Number(row.noOfPeople)),
      0
    ),
    type: "",
    modeOfPayment: "",
    fullname: "",
    mobileNumber: "",
    checkInTime: "",
    checkOutTime: "",
  };

  useEffect(() => {
    onSubmit(rows);
  }, [onSubmit, rows, selectedDate]);

  const tableComponentColumns = [
    {
      headerName: "Room",
      headerBackColor: "rgb(164, 169, 175)",
    },
    {
      headerName: "Price",
      headerBackColor: "rgb(164, 169, 175)",
    },
    {
      headerName: "Rate",
      headerBackColor: "rgb(247, 180, 38)",
    },
    {
      headerName: "People",
      headerBackColor: "rgb(247, 180, 38)",
    },
    {
      headerName: "Check In",
      headerBackColor: "rgb(157, 186, 255)",
    },
    {
      headerName: "Check Out",
      headerBackColor: "rgb(157, 186, 255)",
    },
    {
      headerName: "Type",
      headerBackColor: "rgb(247, 180, 38)",
    },
    {
      headerName: "Payment",
      headerBackColor: "rgb(247, 180, 38)",
    },
    {
      headerName: "Full Name",
      headerBackColor: "rgb(157, 186, 255)",
    },
    {
      headerName: "Mobile",
      headerBackColor: "rgb(157, 186, 255)",
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: 3 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ border: "1px solid #000" }}>
              {tableComponentColumns.map((column, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #fff",
                    backgroundColor: column.headerBackColor || "transparent",
                    height: "24px",
                    padding: "0px",
                    fontSize: "12px",
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  width: "100%",
                  "& .MuiTableRow-root": {
                    hight: "24px",
                    padding: "0px",
                    fontSize: "12px",
                  },
                  "& .MuiInputBase-input": {
                    padding: "2px 8px",
                  },
                  "& .MuiTableCell-root": {
                    padding: "2px 8px",
                  },
                }}
              >
                <TableCell width={"5%"} className="light-gray">
                  <TextField
                    type="number"
                    value={row.roomNo}
                    fullWidth
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value > 0 && value <= 11) {
                        handleRowEdit({ ...row, roomNo: value });
                      }
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontSize: "12px",
                      },
                    }}
                  />
                </TableCell>
                <TableCell width={"8%"} className="light-gray">
                  <TextField
                    type="number"
                    value={row.cost}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value >= 0) {
                        handleRowEdit({ ...row, cost: value });
                      }
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontSize: "12px",
                      },
                    }}
                  />
                </TableCell>
                <TableCell width={"8%"} className="orange">
                  <TextField
                    type="number"
                    value={row.rate}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value >= 0) {
                        handleRowEdit({ ...row, rate: value });
                      }
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontSize: "12px",
                      },
                    }}
                  />
                </TableCell>
                <TableCell width={"8%"} className="orange">
                  <TextField
                    type="number"
                    value={row.noOfPeople}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value >= 0) {
                        handleRowEdit({ ...row, noOfPeople: value });
                      }
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontSize: "12px",
                      },
                    }}
                  />
                </TableCell>
                <TableCell width={"12%"} className="blue">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      value={
                        row.checkInTime
                          ? dayjs(row.checkInTime, "hh:mm A")
                          : null
                      }
                      onChange={(newValue) => {
                        const formattedTime = newValue
                          ? dayjs(newValue).format("hh:mm A")
                          : null;
                        handleRowEdit({ ...row, checkInTime: formattedTime });
                      }}
                      renderInput={(props) => (
                        <Input
                          {...props}
                          placeholder="Select Time"
                          className="blue"
                        />
                      )}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "24px",
                          fontSize: "12px",
                          textAlign: "center",
                        },
                      }}
                      ampm
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell width={"12%"} className="blue">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      value={
                        row.checkOutTime
                          ? dayjs(row.checkOutTime, "hh:mm A")
                          : null
                      }
                      onChange={(newValue) => {
                        const formattedTime = newValue
                          ? dayjs(newValue).format("hh:mm A")
                          : null;
                        handleRowEdit({ ...row, checkOutTime: formattedTime });
                      }}
                      renderInput={(props) => (
                        <Input
                          {...props}
                          placeholder="Select Time"
                          className="blue"
                        />
                      )}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "24px",
                          fontSize: "12px",
                          padding: "0px",
                        },
                      }}
                      ampm
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell width={"10%"} className="orange">
                  <Select
                    value={row.type || "Select"}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleRowEdit({ ...row, type: value });
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {[
                      "Select",
                      "Single",
                      "Couple",
                      "Family",
                      "Employee",
                      "NRI",
                      "Foreigner",
                      "Group",
                      "Other",
                    ].map((type, index) => (
                      <MenuItem
                        key={index}
                        value={type}
                        className="orange"
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell width={"10%"} className="orange">
                  <Select
                    value={row.modeOfPayment || "Select"}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleRowEdit({ ...row, modeOfPayment: value });
                    }}
                    sx={{
                      backgroundColor:
                        paymentColors[row.modeOfPayment] || "transparent",
                      "& .MuiInputBase-input": {
                        fontSize: "12px",
                      },
                    }}
                  >
                    {["Select", "Cash", "Card", "PPS", "PPC", "UnPaid"].map(
                      (mode, index) => (
                        <MenuItem
                          key={index}
                          value={mode}
                          sx={{
                            fontSize: "12px",
                            backgroundColor: paymentColors[mode],
                            color: "#fff",
                            ":hover": {
                              backgroundColor: "#b6b6b6",
                              color: "#000",
                            },
                          }}
                        >
                          {mode}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </TableCell>
                <TableCell width={"15%"} className="blue">
                  <TextField
                    type="text"
                    value={row.fullname}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleRowEdit({ ...row, fullname: value });
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontSize: "12px",
                      },
                    }}
                  />
                </TableCell>
                <TableCell width={"12%"} className="blue">
                  <TextField
                    type="number"
                    value={row.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 10) {
                        handleRowEdit({ ...row, mobileNumber: value });
                      }
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontSize: "12px",
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {/* Totals Row */}
            <TableRow
              hover
              sx={{
                width: "100%",
                backgroundColor: "#00d639",
                "& .MuiTableRow-root": {
                  hight: "24px",
                  padding: "0px",
                  fontSize: "12px",
                },
                "& .MuiInputBase-input": {
                  padding: "2px 8px",
                },
                "& .MuiTableCell-root": {
                  padding: "2px 8px",
                },
              }}
            >
              <TableCell>{totalsRow.roomNo}</TableCell>
              <TableCell>{totalsRow.cost}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={totalsRow.rate}
                  sx={{
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      fontSize: "12px",
                    },
                  }}
                >
                  {totalsRow.rate}
                </TextField>
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={totalsRow.noOfPeople}
                  sx={{
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      fontSize: "12px",
                    },
                  }}
                >
                  {totalsRow.noOfPeople}
                </TextField>
              </TableCell>
              <TableCell>{totalsRow.checkInTime}</TableCell>
              <TableCell>{totalsRow.checkOutTime}</TableCell>
              <TableCell>{totalsRow.type}</TableCell>
              <TableCell>{totalsRow.modeOfPayment}</TableCell>
              <TableCell>{totalsRow.fullname}</TableCell>
              <TableCell>{totalsRow.mobileNumber}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableComponent;
