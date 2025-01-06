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
} from "@mui/material";
import { useState } from "react";

const tableColumns = ["ID", "Name", "Mobile Number"];

const RestTableComponent = () => {
  const initialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    fullname: `John Doe ${i + 1}`,
    mobileNumber: `123456789${i}`,
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
    const newRow = {
      id: tableData.length + 1,
      fullname: "",
      mobileNumber: "",
    };
    setTableData([...tableData, newRow]);
  };

  const handleUpdateRow = (index, key, value) => {
    const updatedData = tableData.map((row, i) =>
      i === index ? { ...row, [key]: value } : row
    );
    setTableData(updatedData);
  };

  return (
    <div style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: 3 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ border: "1px solid #000" }}>
              {tableColumns.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Autocomplete
                    options={fullNameOptions}
                    getOptionLabel={(option) => option.title}
                    value={
                      fullNameOptions.find(
                        (option) => option.title === row.fullname
                      ) || null
                    }
                    onChange={(event, value) =>
                      handleUpdateRow(
                        index,
                        "fullname",
                        value ? value.title : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
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
                      handleUpdateRow(
                        index,
                        "mobileNumber",
                        value ? value.title : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddRow}
        sx={{ mt: 2 }}
      >
        Add Row
      </Button>
    </div>
  );
};

export default RestTableComponent;
