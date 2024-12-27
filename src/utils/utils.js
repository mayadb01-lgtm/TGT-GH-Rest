export const paymentColors = {
  Card: "rgb(75, 144, 127)",
  PPC: "rgb(199, 133, 189)",
  PPS: "rgb(134, 165, 55)",
  Cash: "rgb(44, 190, 132)",
  UnPaid: "rgb(234,138,122)",
  Select: "rgb(48, 123, 161)",
};

export const processEntriesByPaymentMode = (data, mode) => {
  if (data?.length === 0) return [];
  return data?.filter((row) => row.modeOfPayment === mode);
};

export const roomCosts = {
  1: 1800,
  2: 1800,
  3: 1800,
  4: 1800,
  5: 1800,
  6: 2200,
  7: 2200,
  8: 1800,
  9: 1500,
  10: 1500,
  11: 1500,
};

export const initializePendingJamaRows = () => {
  return Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 1,
    date: "",
    roomNo: 0,
    fullname: "",
    mobileNumber: 0,
    rate: 0,
    modeOfPayment: "",
    period: "UnPaid",
  }));
};

// modeSummaryColumn for DataGrid SummaryTable
export const modeSummaryColumn = [
  { field: "id", headerName: "Day/Night", width: 80 },
  { field: "rate", headerName: "Rate", width: 60 },
  { field: "fullname", headerName: "Full Name", width: 100 },
  { field: "noOfPeople", headerName: "People", width: 80 },
];

export const finalModeColumns = [
  { field: "id", headerName: "Revenue", width: "160" },
  { field: "totals", headerName: "Total", width: "160" },
];

export const processEntries = (data, period, selectedDate, updatedDate) => {
  return data
    .filter(
      (row) =>
        row.rate !== 0 &&
        row.noOfPeople !== 0 &&
        row.type !== "" &&
        row.modeOfPayment !== ""
    )
    .map((row) => ({
      ...row,
      period,
      date: selectedDate,
      createDate: updatedDate,
    }))
    .sort((a, b) => a.roomNo - b.roomNo);
};
