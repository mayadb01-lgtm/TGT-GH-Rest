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
} from "@mui/material";
import { useState } from "react";

const expensesTableColumns = ["ID", "Name", "Mobile Number", "Category"];

const RestExpensesTable = () => {
  const categories = [
    { title: "Category 1" },
    { title: "Category 2" },
    { title: "Category 3" },
    { title: "Category 4" },
  ];
  const initialData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    fullname: `John Doe ${i + 1}`,
    mobileNumber: `123456789${i}`,
    category: categories[Math.floor(Math.random() * categories.length)].title,
  }));

  const [expensesTableData, setExpensesTableData] = useState(initialData);

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

  const handleUpdateRow = (index, key, value) => {
    const updatedData = expensesTableData.map((row, i) =>
      i === index ? { ...row, [key]: value } : row
    );
    setExpensesTableData(updatedData);
  };

  return (
    <div style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
      <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: 3 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ border: "1px solid #000" }}>
              {expensesTableColumns.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {initialData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Autocomplete
                    options={fullNameOptions}
                    getOptionLabel={(option) => option.title}
                    value={fullNameOptions.find(
                      (option) => option.title === row.fullname
                    )}
                    onChange={(e, value) =>
                      handleUpdateRow(index, "fullname", value.title)
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
                    value={mobileNumberOptions.find(
                      (option) => option.title === row.mobileNumber
                    )}
                    onChange={(e, value) =>
                      handleUpdateRow(index, "mobileNumber", value.title)
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option.title}
                    value={categories.find(
                      (option) => option.title === row.category
                    )}
                    onChange={(e, value) =>
                      handleUpdateRow(index, "category", value.title)
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
    </div>
  );
};

export default RestExpensesTable;
