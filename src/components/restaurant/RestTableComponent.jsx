import React, { useState, useMemo } from "react";
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

const tableColumns = ["ID", "Name", "Mobile Number"];

const initialData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  fullname: "",
  mobileNumber: "",
}));

const fullNameOptions = [
  { title: "John Doe" },
  { title: "Jane Doe" },
  { title: "John Smith" },
  { title: "Jane Smith" },
];

const mobileNumberOptions = [{ title: "1234567890" }, { title: "0987654321" }];

const EditableRow = ({ row, index, onUpdateRow }) => (
  <TableRow>
    <TableCell>{row.id}</TableCell>
    <TableCell>
      <Autocomplete
        options={fullNameOptions}
        getOptionLabel={(option) => option.title}
        value={
          fullNameOptions.find((option) => option.title === row.fullname) ||
          null
        }
        onChange={(event, value) =>
          onUpdateRow(index, "fullname", value ? value.title : "")
        }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" size="small" />
        )}
        disableClearable
      />
    </TableCell>
    <TableCell>
      <Autocomplete
        options={mobileNumberOptions}
        getOptionLabel={(option) => option.title}
        value={
          mobileNumberOptions.find(
            (option) => option.title === row.mobileNumber
          ) || null
        }
        onChange={(event, value) =>
          onUpdateRow(index, "mobileNumber", value ? value.title : "")
        }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" size="small" />
        )}
        disableClearable
      />
    </TableCell>
  </TableRow>
);

const RestTableComponent = () => {
  const [tableData, setTableData] = useState(initialData);

  const handleAddRow = () => {
    setTableData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, fullname: "", mobileNumber: "" },
    ]);
  };

  const handleUpdateRow = (index, key, value) => {
    setTableData((prevData) =>
      prevData.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  const memoizedTableData = useMemo(() => tableData, [tableData]);

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%", boxShadow: 3, marginTop: 2 }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {tableColumns.map((column, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold" }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {memoizedTableData.map((row, index) => (
              <EditableRow
                key={row.id}
                row={row}
                index={index}
                onUpdateRow={handleUpdateRow}
              />
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRow}
          sx={{ margin: 2 }}
          s
        >
          Add Row
        </Button>
      </TableContainer>
    </div>
  );
};

export default RestTableComponent;
