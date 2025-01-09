import { useCallback } from "react";
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

const columns = ["ID", "Amount", "Name", "Mobile Number", "Category"];

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

const ExpensesTable = ({
  restExpensesData,
  setRestExpensesData,
  selectedDate,
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

  const handleAddRow = useCallback(() => {
    setRestExpensesData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, fullname: "", mobileNumber: "", category: "" },
    ]);
  }, [setRestExpensesData]);

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

  // Calculation Rows at End of Table
  // 1. Total Expenses
  // Row Amount Column = Value
  // Other Columns Merge and Text = Total Expenses
  // 2. Total Upad
  // Row Amount Column = Value
  // Other Columns Merge and Text = Total Upad
  // 3. Total Pending
  // Row Amount Column = Value
  // Other Columns Merge and Text = Total Pending
  // 4. Total Card
  // Row Amount Column = Value
  // Other Columns Merge and Text = Total Card
  // 5. Total PP
  // Row Amount Column = Value
  // Other Columns Merge and Text = Total PP
  // 6. Total Cash
  // Row Amount Column = Value
  // Other Columns Merge and Text = Total Cash
  // 7. Grand Total
  // Row Amount Column = Value

  const calculationRows = [
    {
      label: "Total Expenses",
      amount: totalExpenses,
    },
    {
      label: "Total Upad",
      amount: totalUpad,
    },
    {
      label: "Total Pending",
      amount: totalPending,
    },
    {
      label: "Total Card",
      amount: totalCard,
    },
    {
      label: "Total PP",
      amount: totalPP,
    },
    {
      label: "Total Cash",
      amount: totalCash,
    },
    {
      label: "Grand Total",
      amount: grandTotal,
    },
    {
      label: "Extra Amount",
      amount: extraAmount,
    },
  ];

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
          {restExpensesData.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>
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
        <TableBody>
          {calculationRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell></TableCell>
              <TableCell colSpan={2}>{row.label}</TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  value={row.amount}
                  onChange={(e) => {
                    if (row.label === "Total Cash") {
                      setTotalCash(e.target.value);
                    } else if (row.label === "Total Card") {
                      setTotalCard(e.target.value);
                    } else if (row.label === "Total PP") {
                      setTotalPP(e.target.value);
                    } else {
                      return;
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

export default ExpensesTable;
