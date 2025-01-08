export const paymentColors = {
  Card: "rgb(75, 144, 127)",
  PPC: "rgb(199, 133, 189)",
  PPS: "rgb(134, 165, 55)",
  Cash: "rgb(44, 190, 132)",
  UnPaid: "rgb(234,138,122)",
  Summary: "rgb(31, 123, 0)",
  Select: "transparent",
};

export const typeColors = {
  Select: "transparent",
  Single: "rgb(44, 190, 132)",
  Couple: "rgb(75, 144, 127)",
  Family: "rgb(199, 133, 189)",
  Employee: "rgb(134, 165, 55)",
  NRI: "rgb(234,138,122)",
  Foreigner: "rgb(230, 100, 100)",
  Group: "rgb(100, 150, 200)",
  Other: "rgb(255, 170, 50)",
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
    createDate: "",
    _id: "",
    cost: 0,
    checkInTime: "",
    checkOutTime: "",
    noOfPeople: 0,
  }));
};

// modeSummaryColumn for DataGrid SummaryTable
export const modeSummaryColumn = [
  { field: "id", headerName: "Day/Night", width: 100 },
  { field: "rate", headerName: "Rate", width: 40 },
  { field: "fullname", headerName: "Full Name", width: 110 },
  { field: "noOfPeople", headerName: "People", width: 80 },
];

export const finalModeColumns = [
  { field: "id", headerName: "Revenue", width: "160" },
  { field: "totals", headerName: "Total", width: "160" },
];

export const processEntries = (data, period, selectedDate, currentDateTime) => {
  return data
    .filter(
      (row) =>
        row.rate !== 0 &&
        // row.noOfPeople !== 0 &&
        // row.type !== "" &&
        row.modeOfPayment !== ""
    )
    .map((row) => ({
      ...row,
      period,
      date: selectedDate,
      createDate: selectedDate,
      updatedDateTime: currentDateTime,
    }))
    .sort((a, b) => a.roomNo - b.roomNo);
};

export const processUpdateEntries = (data, period, selectedDate) => {
  return data
    .filter(
      (row) =>
        row.rate !== 0 &&
        // row.noOfPeople !== 0 &&
        // row.type !== "" &&
        row.modeOfPayment !== ""
    )
    .map((row) => ({
      ...row,
      period,
      date: selectedDate,
      updatedDateTime: currentDateTime,
    }))
    .sort((a, b) => a.roomNo - b.roomNo);
};

// Table Component

export const initializeRows = (period, rowsLength, roomCosts) => {
  return Array.from({ length: rowsLength }, (_, i) => ({
    id: `${period} - ${i + 1}`,
    roomNo: i + 1,
    cost: roomCosts[i + 1] || 0,
    rate: 0,
    noOfPeople: 0,
    type: "",
    modeOfPayment: "",
    fullname: `${period} - ${i + 1} Name`,
    mobileNumber: 1234567890,
    checkInTime: "",
    checkOutTime: "",
    period: period,
    createDate: "",
  }));
};

export const currentDateTime = new Date().toString();
