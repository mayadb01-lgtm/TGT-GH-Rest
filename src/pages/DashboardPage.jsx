import { useEffect, useState } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useDispatch, useSelector } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { createTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { useDemoRouter } from "@toolpad/core/internal";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { getEntriesByDate } from "../redux/actions/entryAction";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Navigation items
const NAVIGATION = [
  { kind: "header", title: "Main items" },
  {
    kind: "link",
    title: "Dashboard",
    icon: <DashboardIcon />,
    to: "/dashboard",
  },
  { kind: "divider" },
  { kind: "link", title: "Profile", to: "/profile" },
  { kind: "link", title: "Log out", to: "/logout" },
  { kind: "link", title: "Home", to: "/" },
];

// Theme setup
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Dashboard content component
const DashboardContent = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );
  const { loading, entries } = useSelector((state) => state.entry);

  const dispatch = useDispatch();

  const handleDateChange = (newDate) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  useEffect(() => {
    dispatch(getEntriesByDate(selectedDate));
  }, [dispatch, selectedDate]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "roomNo", headerName: "Room No", width: 130 },
    { field: "cost", headerName: "Cost", width: 90 },
    { field: "rate", headerName: "Rate", width: 90 },
    { field: "noOfPeople", headerName: "People", width: 130 },
    { field: "type", headerName: "Type", width: 130 },
    { field: "modeOfPayment", headerName: "Mode of Payment", width: 130 },
    { field: "checkInTime", headerName: "Check In Time", width: 130 },
    { field: "checkOutTime", headerName: "Check Out Time", width: 130 },
    { field: "date", headerName: "Date", width: 130 },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Stack direction="row" spacing={1} style={{ alignItems: "center" }}>
        <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
          Select Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                size="small"
              />
            )}
            views={["day", "month", "year"]}
            format="DD-MM-YYYY"
          />
        </LocalizationProvider>
      </Stack>
      <DataGrid
        rows={entries.map((entry, index) => ({ ...entry, id: index + 1 }))}
        columns={columns}
        pageSize={5}
      />
    </Box>
  );
};

// Placeholder components for other pages
const ProfilePage = () => <Typography>Profile Page Content</Typography>;
const HomePage = () => <Typography>Home Page Content</Typography>;
const LogoutPage = () => <Typography>Logout Page Content</Typography>;

// Main page component
const DashboardPage = () => {
  const router = useDemoRouter("/dashboard");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    if (currentPage === "dashboard") {
      dispatch(getEntriesByDate(dayjs().format("DD-MM-YYYY")));
    }
  }, [dispatch, currentPage]);

  const renderPageContent = () => {
    switch (currentPage) {
      case "profile":
        return <ProfilePage />;
      case "home":
        return <HomePage />;
      case "logout":
        return <LogoutPage />;
      default:
        return <DashboardContent />;
    }
  };

  const CustomAppTitle = () => (
    <Typography variant="h6" color="textPrimary">
      Ashirwad Admin Dashboard
    </Typography>
  );

  return (
    <AppProvider
      navigation={NAVIGATION.map((item) => ({
        ...item,
        onClick: item.to
          ? () => setCurrentPage(item.to.replace("/", ""))
          : undefined,
      }))}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout
        slots={{
          appTitle: CustomAppTitle,
        }}
      >
        {renderPageContent()}
      </DashboardLayout>
    </AppProvider>
  );
};

export default DashboardPage;
