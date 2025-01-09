import React, { useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Autocomplete,
  TextField,
  Button,
  Paper,
} from "@mui/material";

const columns = ["ID", "Name", "Mobile Number", "Category"];

const categories = [
  { title: "Category 1" },
  { title: "Category 2" },
  { title: "Category 3" },
  { title: "Category 4" },
];

const fullNameOptions = [
  { title: "John Doe" },
  { title: "Jane Doe" },
  { title: "John Smith" },
  { title: "Jane Smith" },
];

const mobileNumberOptions = [{ title: "1234567890" }, { title: "0987654321" }];

const generateInitialData = () =>
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    fullname: "",
    mobileNumber: "",
    category: "",
  }));

const ExpensesTable = () => {
  const [tableData, setTableData] = useState(generateInitialData);

  const handleUpdateRow = useCallback((index, key, value) => {
    setTableData((prevData) =>
      prevData.map((row, i) =>
        i === index ? { ...row, [key]: value || "" } : row
      )
    );
  }, []);

  // Const Calculation Rows

  // Total of All Amounts
  // const totalExpensesAmount = useMemo(() => {
  //   return tableData.reduce((total, row) => total + Number(row.amount), 0);
  // }, [tableData]);

  const handleAddRow = useCallback(() => {
    setTableData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, fullname: "", mobileNumber: "", category: "" },
    ]);
  }, []);

  const renderAutocomplete = (options, rowKey, index, currentValue) => (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.title || ""}
      value={options.find((option) => option.title === currentValue) || null}
      onChange={(e, value) => handleUpdateRow(index, rowKey, value?.title)}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" size="small" />
      )}
      isOptionEqualToValue={(option, value) => option.title === value.title}
    />
  );

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: "100%", boxShadow: 3, marginTop: 2 }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} sx={{ fontWeight: "bold" }}>
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
                {renderAutocomplete(
                  fullNameOptions,
                  "fullname",
                  index,
                  row.fullname
                )}
              </TableCell>
              <TableCell>
                {renderAutocomplete(
                  mobileNumberOptions,
                  "mobileNumber",
                  index,
                  row.mobileNumber
                )}
              </TableCell>
              <TableCell>
                {renderAutocomplete(
                  categories,
                  "category",
                  index,
                  row.category
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
  );
};

export default ExpensesTable;
