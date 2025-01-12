import PropTypes from "prop-types";
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
import { fullNameOptions, mobileNumberOptions } from "../../utils/utils";

const TABLE_COLUMNS = ["ID", "Amount", "Name", "Mobile Number"];

const RestPendingTable = ({ restPendingData, setRestPendingData }) => {
  const handleAddRow = () => {
    setRestPendingData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        fullname: "",
        mobileNumber: 0,
        amount: 0,
      },
    ]);
  };

  const handleUpdateRow = (index, key, value) => {
    setRestPendingData((prevData) =>
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
      disableClearable
    />
  );

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%", boxShadow: 3, mt: 2 }}
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
            {restPendingData.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell sx={{ width: "5%" }}>{row.id}</TableCell>
                <TableCell sx={{ width: "25%" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    type="number"
                    value={row.amount || ""}
                    onChange={(e) =>
                      handleUpdateRow(index, "amount", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell sx={{ width: "40%" }}>
                  {renderAutocompleteCell(
                    fullNameOptions,
                    row,
                    index,
                    "fullname"
                  )}
                </TableCell>
                <TableCell sx={{ width: "30%" }}>
                  <Autocomplete
                    options={mobileNumberOptions}
                    type="number"
                    getOptionLabel={(option) => String(option.title) || ""}
                    value={
                      mobileNumberOptions.find(
                        (option) =>
                          String(option.title) === String(row.mobileNumber)
                      ) || ""
                    }
                    onChange={(event, value) =>
                      handleUpdateRow(index, "mobileNumber", value?.title || "")
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" size="small" />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      String(option.title) === String(value?.title)
                    }
                  />
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
    </div>
  );
};

RestPendingTable.propTypes = {
  restPendingData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fullname: PropTypes.string,
      mobileNumber: PropTypes.number,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  setRestPendingData: PropTypes.func.isRequired,
};

export default RestPendingTable;
