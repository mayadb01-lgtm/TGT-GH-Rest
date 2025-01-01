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

  return (
    <div>
      <DataGrid
        rows={pendingJamaGridRows}
        columns={[
          { field: "id", headerName: "Index", width: 70 },
          { field: "createDate", headerName: "Created Date", width: 130 },
          { field: "roomNo", headerName: "Room No", width: 130 },
          { field: "fullname", headerName: "Full Name", width: 130 },
          { field: "mobileNumber", headerName: "Mobile No", width: 130 },
          { field: "rate", headerName: "Rate", width: 130 },
          { field: "modeOfPayment", headerName: "Mode of Payment", width: 130 },
        ]}
        pageSize={5}
      />
    </div>
  );
};

export default PendingJamaGrid;
