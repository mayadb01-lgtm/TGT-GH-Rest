import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PendingJamaGrid = () => {
  const { unpaidEntries } = useSelector((state) => state.entry);
  const [pendingJamaGridRows, setPendingJamaGridRows] = useState([]);

  useEffect(() => {
    if (unpaidEntries.length > 0) {
      const rows = unpaidEntries.map((entry, index) => {
        return {
          id: index + 1,
          createDate: entry.createDate,
          roomNo: entry.roomNo,
          fullname: entry.fullname,
          mobileNumber: entry.mobileNumber,
          rate: entry.rate,
          modeOfPayment: entry.modeOfPayment,
        };
      });
      setPendingJamaGridRows(rows);
    }
  }, [unpaidEntries]);

  const totalRow = {
    id: "Total",
    createDate: "",
    roomNo: "",
    fullname: "",
    mobileNumber: "",
    rate: pendingJamaGridRows.reduce((acc, curr) => acc + curr.rate, 0),
    modeOfPayment: "",
  };

  return (
    <div>
      <DataGrid
        rows={[...pendingJamaGridRows, totalRow]}
        columns={[
          { field: "id", headerName: "Index", width: 70 },
          { field: "createDate", headerName: "Created Date", width: 130 },
          { field: "roomNo", headerName: "Room No", width: 130 },
          { field: "fullname", headerName: "Full Name", width: 180 },
          { field: "mobileNumber", headerName: "Mobile No", width: 150 },
          { field: "rate", headerName: "Rate", width: 130 },
          { field: "modeOfPayment", headerName: "Mode of Payment", width: 130 },
        ]}
        rowHeight={35}
        sx={{
          fontSize: "12px",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            display: "flex",
            justifyContent: "center",
          },
          "& .MuiDataGrid-columnHeader": {
            maxHeight: "35px",
            fontWeight: "bold",
            border: "0.5px solid #f0f0f0",
            backgroundColor: "#f1f1f1",
          },
          "& .MuiDataGrid-row": {
            maxHeight: "35px",
          },
          "& .MuiDataGrid-cell": {
            maxHeight: "35px",
            textAlign: "center",
            border: "0.5px solid #f0f0f0",
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
          "& .total-row": {
            fontWeight: "bold",
          },
        }}
        getRowClassName={(params) =>
          params.row.id === "Total" ? "total-row" : ""
        }
      />
    </div>
  );
};

export default PendingJamaGrid;
