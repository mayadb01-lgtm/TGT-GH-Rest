import { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
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
import {
  categories,
  fullNameOptions,
  mobileNumberOptions,
} from "../../utils/utils";

const ExpensesTable = ({
  restExpensesData,
  setRestExpensesData,
  totalExpenses,
  totalUpad,
  totalPending,
  totalCard,
  setTotalCard,
  totalPP,
  setTotalPP,
  totalCash,
  setTotalCash,
  grandTotal,
  extraAmount,
}) => {
  // Column headers
  const columns = useMemo(
    () => ["ID", "Amount", "Name", "Mobile Number", "Category"],
    []
  );

  // Calculation rows
  const calculationRows = useMemo(
    () => [
      { label: "Total Expenses", amount: totalExpenses },
      { label: "Total Upad", amount: totalUpad },
      { label: "Total Pending", amount: totalPending },
      { label: "Total Card", amount: totalCard },
      { label: "Total PP", amount: totalPP },
      { label: "Total Cash", amount: totalCash },
      { label: "Grand Total", amount: grandTotal },
      { label: "Extra Amount", amount: extraAmount },
    ],
    [
      totalExpenses,
      totalUpad,
      totalPending,
      totalCard,
      totalPP,
      totalCash,
      grandTotal,
      extraAmount,
    ]
  );

  // Update row data
  const handleUpdateRow = useCallback(
    (index, key, value) => {
      setRestExpensesData((prevData) =>
        prevData.map((row, i) =>
          i === index ? { ...row, [key]: value || "" } : row
        )
      );
    },
    [setRestExpensesData]
  );

  // Add a new row
  const handleAddRow = useCallback(() => {
    setRestExpensesData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        amount: 0,
        fullname: "",
        mobileNumber: 0,
        category: "",
      },
    ]);
  }, [setRestExpensesData]);

  // Render autocomplete field
  const renderAutocomplete = useCallback(
    (options, rowKey, index, currentValue) => (
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.title || ""}
        value={options.find((option) => option.title === currentValue) || ""}
        onChange={(e, value) => handleUpdateRow(index, rowKey, value?.title)}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" size="small" />
        )}
        isOptionEqualToValue={(option, value) => option.title === value?.title}
      />
    ),
    [handleUpdateRow]
  );

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, marginTop: 2 }}>
      <Table size="small" stickyHeader>
        {/* Table Header */}
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} sx={{ fontWeight: "bold" }}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Dynamic Rows */}
          {restExpensesData.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell sx={{ width: "5%" }}>{row.id}</TableCell>
              <TableCell sx={{ width: "15%" }}>
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
              <TableCell sx={{ width: "25%" }}>
                {renderAutocomplete(
                  fullNameOptions,
                  "fullname",
                  index,
                  row.fullname
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
              <TableCell sx={{ width: "30%" }}>
                {renderAutocomplete(
                  categories,
                  "category",
                  index,
                  row.category
                )}
              </TableCell>
            </TableRow>
          ))}
          {/* Calculation Rows */}
          {calculationRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell colSpan={2}>{row.label}</TableCell>
              <TableCell colSpan={3}>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={row.amount || ""}
                  onChange={(e) => {
                    switch (row.label) {
                      case "Total Cash":
                        setTotalCash(Number(e.target.value));
                        break;
                      case "Total Card":
                        setTotalCard(Number(e.target.value));
                        break;
                      case "Total PP":
                        setTotalPP(Number(e.target.value));
                        break;
                      default:
                        break;
                    }
                  }}
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
  );
};

ExpensesTable.propTypes = {
  restExpensesData: PropTypes.arrayOf(PropTypes.object).isRequired,
  setRestExpensesData: PropTypes.func.isRequired,
  totalExpenses: PropTypes.number.isRequired,
  totalUpad: PropTypes.number.isRequired,
  totalPending: PropTypes.number.isRequired,
  totalCard: PropTypes.number.isRequired,
  setTotalCard: PropTypes.func.isRequired,
  totalPP: PropTypes.number.isRequired,
  setTotalPP: PropTypes.func.isRequired,
  totalCash: PropTypes.number.isRequired,
  setTotalCash: PropTypes.func.isRequired,
  grandTotal: PropTypes.number.isRequired,
  extraAmount: PropTypes.number.isRequired,
};

export default ExpensesTable;
