import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";

dayjs.locale("en-gb");

const PendingJamaTable = () => {
  const { unpaidEntries } = useSelector((state) => state.entry);

  const getRoomNoList = (date) => {
    return [
      ...new Set(
        unpaidEntries
          .filter((entry) => entry.date === date)
          .map((entry) => entry.roomNo)
      ),
    ];
  };

  const getFullNameList = (date, roomNo) => {
    return unpaidEntries
      .filter((entry) => entry.date === date && entry.roomNo === roomNo)
      .map((entry) => entry.fullname);
  };

  const getMobileNumberList = (date, roomNo, fullname) => {
    return unpaidEntries
      .filter(
        (entry) =>
          entry.date === date &&
          entry.roomNo === roomNo &&
          entry.fullname.toLowerCase() === fullname.toLowerCase()
      )
      .map((entry) => entry.mobileNumber);
  };

  const getRateList = (date, roomNo, fullname, mobileNumber) => {
    return unpaidEntries
      .filter(
        (entry) =>
          entry.date === date &&
          entry.roomNo === roomNo &&
          entry.fullname.toLowerCase() === fullname.toLowerCase() &&
          entry.mobileNumber === mobileNumber
      )
      .map((entry) => entry.rate);
  };

  const initializePendingJamaRows = () => {
    return Array.from({ length: 10 }, (_, idx) => ({
      id: idx + 1,
      date: "",
      roomNo: "",
      fullname: "",
      mobileNumber: "",
      rate: 0,
      modeOfPayment: "",
    }));
  };

  const [pendingJamaRows, setPendingJamaRows] = useState(
    initializePendingJamaRows
  );

  const handleRowEdit = (id, field, value) => {
    setPendingJamaRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: 3 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {[
              "ID",
              "Date",
              "Room No",
              "Full Name",
              "Mobile No",
              "Rate",
              "Mode of Payment",
            ].map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f4f6f8",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  height: "24px",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingJamaRows.map((row) => (
            <TableRow
              key={row.id}
              hover
              sx={{
                "& .MuiTableRow-root": {
                  hight: "24px",
                  padding: "0px",
                },
                "& .MuiInputBase-input": {
                  padding: "2px 8px",
                },
                "& .MuiTableCell-root": {
                  padding: "2px 8px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                },
              }}
            >
              <TableCell>{row.id}</TableCell>
              <TableCell>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    value={row.date ? dayjs(row.date, "DD-MM-YYYY") : null}
                    onChange={(newDate) => {
                      const formattedDate = dayjs(newDate).format("DD-MM-YYYY");
                      handleRowEdit(row.id, "date", formattedDate);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} size="small" fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </TableCell>
              <TableCell>
                <Select
                  value={row.roomNo}
                  onChange={(e) =>
                    handleRowEdit(row.id, "roomNo", e.target.value)
                  }
                  fullWidth
                >
                  {getRoomNoList(row.date).map((roomNo) => (
                    <MenuItem key={roomNo} value={roomNo}>
                      {roomNo}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={row.fullname}
                  onChange={(e) =>
                    handleRowEdit(row.id, "fullname", e.target.value)
                  }
                  fullWidth
                >
                  {getFullNameList(row.date, row.roomNo).map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={row.mobileNumber}
                  onChange={(e) =>
                    handleRowEdit(row.id, "mobileNumber", e.target.value)
                  }
                  fullWidth
                >
                  {getMobileNumberList(row.date, row.roomNo, row.fullname).map(
                    (num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    )
                  )}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={row.rate}
                  onChange={(e) =>
                    handleRowEdit(row.id, "rate", e.target.value)
                  }
                  fullWidth
                >
                  {getRateList(
                    row.date,
                    row.roomNo,
                    row.fullname,
                    row.mobileNumber
                  ).map((rate) => (
                    <MenuItem key={rate} value={rate}>
                      {rate}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={row.modeOfPayment}
                  onChange={(e) =>
                    handleRowEdit(row.id, "modeOfPayment", e.target.value)
                  }
                  fullWidth
                >
                  {["Select", "Card", "PPC", "PPS", "Cash", "UnPaid"].map(
                    (mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode}
                      </MenuItem>
                    )
                  )}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PendingJamaTable;
