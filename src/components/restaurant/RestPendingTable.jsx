import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  TableCell,
  Autocomplete,
  TextField,
  Button,
  Box,
} from "@mui/material";

const TABLE_COLUMNS = ["ID", "Name", "Mobile Number"];

const RestRestTable = () => {
  const initialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    fullname: "",
    mobileNumber: "",
    amount: "",
  }));

  const [tableData, setTableData] = useState(initialData);

  const fullNameOptions = [
    { title: "John Doe" },
    { title: "Jane Doe" },
    { title: "John Smith" },
    { title: "Jane Smith" },
  ];

  const mobileNumberOptions = [
    { title: "1234567890" },
    { title: "0987654321" },
  ];

  const handleAddRow = () => {
    setTableData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        fullname: "",
        mobileNumber: "",
        amount: "",
      },
    ]);
  };

  const handleUpdateRow = (index, key, value) => {
    setTableData((prevData) =>
      prevData.map((row, i) =>
        i === index ? { ...row, [key]: value || "" } : row
      )
    );
  };

  const renderAutocompleteCell = (options, row, index, fieldKey) => (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.title || ""}
      value={options.find((option) => option.title === row[fieldKey]) || null}
      onChange={(_, value) =>
        handleUpdateRow(index, fieldKey, value ? value.title : "")
      }
      renderInput={(params) => (
        <TextField {...params} variant="outlined" size="small" fullWidth />
      )}
    />
  );

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%", boxShadow: 3, marginTop: 2 }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {TABLE_COLUMNS.map((column) => (
                <TableCell key={column} sx={{ fontWeight: "bold" }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.amount}
                    onChange={(e) =>
                      handleUpdateRow(index, "amount", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  {renderAutocompleteCell(
                    fullNameOptions,
                    row,
                    index,
                    "fullname"
                  )}
                </TableCell>
                <TableCell>
                  {renderAutocompleteCell(
                    mobileNumberOptions,
                    row,
                    index,
                    "mobileNumber"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRow}
          sx={{ margin: 2 }}
        >
          Add Row
        </Button>
      </TableContainer>
    </Box>
  );
};

export default RestRestTable;
