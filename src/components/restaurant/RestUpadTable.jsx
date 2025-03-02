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

const tableColumns = ["ID", "Amount", "Name"];

const EditableRow = ({ row, index, onUpdateRow, fieldOptions }) => {
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
      <TableCell sx={{ width: "70%" }}>
        <Autocomplete
          options={fieldOptions}
          getOptionLabel={(option) => option.fullname || ""}
          value={
            fieldOptions.find((option) => option.fullname === row.fullname) ||
            null
          }
          onChange={(event, value) => {
            handleInputChange("fullname", value?.fullname || "");
            handleInputChange("mobileNumber", value?.mobileNumber || "");
            handleInputChange("_id", value?._id ? value._id : "");
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" size="small" fullWidth />
          )}
        />
      </TableCell>
    </TableRow>
  );
};

const RestUpadTable = ({ restUpadData, setRestUpadData, fieldOptions }) => {
  const handleAddRow = () => {
    setRestUpadData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        _id: "",
        amount: 0,
        fullname: "",
        mobileNumber: 0,
      },
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
                fieldOptions={fieldOptions}
              />
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRow}
          size="small"
          sx={{ m: 2 }}
        >
          Add Row
        </Button>
      </TableContainer>
    </div>
  );
};

export default RestUpadTable;
