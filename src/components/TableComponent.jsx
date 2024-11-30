import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import EntryFormModal from "./EntryFormModal";
import CalculationSummary from "./CalculationSummary";
import { Button } from "@mui/material";

const TableComponent = ({ title, rowsLength, roomCosts, onSubmit }) => {
  const [rows, setRows] = useState(
    Array.from({ length: rowsLength }, (_, i) => ({
      id: i + 1,
      roomNo: i + 1,
      cost: roomCosts[i + 1],
      rate: 0,
      noOfPeople: 0,
      type: "",
      modeOfPayment: "",
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleSave = (updatedRow) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    setIsModalOpen(false);
  };

  const totalAmount = rows.reduce((sum, row) => sum + row.cost, 0);

  return (
    <div style={{ marginBottom: "32px" }}>
      <h3>{title}</h3>
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={[
            { field: "roomNo", headerName: "Room No", width: 120 },
            { field: "cost", headerName: "Cost", width: 120 },
            { field: "rate", headerName: "Rate", width: 120 },
            { field: "noOfPeople", headerName: "People", width: 120 },
            { field: "type", headerName: "Type", width: 120 },
            { field: "modeOfPayment", headerName: "Payment", width: 150 },
            {
              field: "actions",
              headerName: "Actions",
              width: 200,
              renderCell: (params) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenModal(params.row)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleOpenModal(params.row)}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          pageSize={5}
        />
      </div>
      <CalculationSummary totalAmount={totalAmount} />
      <Button
        variant="contained"
        color="success"
        onClick={() => onSubmit(rows)}
        style={{ marginTop: "16px" }}
      >
        Submit Table
      </Button>
      <EntryFormModal
        isOpen={isModalOpen}
        row={selectedRow}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default TableComponent;
