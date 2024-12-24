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
