import { useMemo } from "react";
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
import { fullNameOptions, mobileNumberOptions } from "../../utils/utils";

const tableColumns = ["ID", "Amount", "Name", "Mobile Number"];

const EditableRow = ({ row, index, onUpdateRow }) => {
  const handleInputChange = (key, value) => {
    onUpdateRow(index, key, value);
  };

  return (
    <TableRow>
      <TableCell sx={{ width: "5%" }}>{row.id}</TableCell>
      <TableCell sx={{ width: "25%" }}>
        <TextField
          variant="outlined"
          type="number"
          size="small"
          value={row.amount || ""}
          onChange={(e) => handleInputChange("amount", e.target.value)}
          fullWidth
        />
      </TableCell>
      <TableCell sx={{ width: "40%" }}>
        <Autocomplete
          options={fullNameOptions}
          getOptionLabel={(option) => option.title}
          value={
            fullNameOptions.find((option) => option.title === row.fullname) ||
            null
          }
          onChange={(event, value) =>
            handleInputChange("fullname", value?.title || "")
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" size="small" fullWidth />
          )}
          disableClearable
        />
      </TableCell>
      <TableCell sx={{ width: "30%" }}>
        <Autocomplete
          options={mobileNumberOptions}
          type="number"
          getOptionLabel={(option) => String(option.title) || ""}
          value={
            mobileNumberOptions.find(
              (option) => String(option.title) === String(row.mobileNumber)
            ) || null
          }
          onChange={(event, value) =>
            handleInputChange("mobileNumber", value?.title || "")
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" size="small" fullWidth />
          )}
          isOptionEqualToValue={(option, value) =>
            String(option.title) === String(value.title)
          }
        />
      </TableCell>
    </TableRow>
  );
};

const RestUpadTable = ({ restUpadData, setRestUpadData, selectedDate }) => {
  const handleAddRow = () => {
    setRestUpadData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, amount: 0, fullname: "", mobileNumber: 0 },
    ]);
  };

  const handleUpdateRow = (index, key, value) => {
    setRestUpadData((prevData) =>
      prevData.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  const memoizedTableData = useMemo(() => restUpadData, [restUpadData]);

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%", boxShadow: 3, mt: 2 }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {tableColumns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: "bold" }}>
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
          sx={{ m: 2 }}
        >
          Add Row
        </Button>
      </TableContainer>
    </div>
  );
};

export default RestUpadTable;
