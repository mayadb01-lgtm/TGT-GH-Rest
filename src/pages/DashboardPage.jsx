import { useEffect, useState, useCallback, useMemo } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { createTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { getEntriesByDate } from "../redux/actions/entryAction";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BarChartIcon from "@mui/icons-material/BarChart";
import RestStaffDashboard from "../components/restaurant/RestStaffDashboard";

dayjs.locale("en-gb");

// Navigation items
const NAVIGATION = [
  { kind: "header", title: "Guest House" },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      { segment: "sales", title: "Sales" },
      { segment: "orders", title: "Orders" },
    ],
  },
  { kind: "header", title: "Restaurant" },
  {
    segment: "restaurant-reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      { segment: "restaurant-sales", title: "Sales" },
      { segment: "restaurant-orders", title: "Orders" },
    ],
  },
  { segment: "manage-staff", title: "Manage Staff", icon: <DashboardIcon /> },
  {
    segment: "categories-expenses",
    title: "Categories & Expenses",
    icon: <DashboardIcon />,
  },
];

// Theme setup
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true },
  breakpoints: { values: { xs: 0, sm: 600, md: 960, lg: 1200, xl: 1536 } },
});

const DashboardContent = () => {
  const dispatch = useAppDispatch();
  const { loading, entries } = useAppSelector((state) => state.entry);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("DD-MM-YYYY")
  );

  const handleDateChange = useCallback(
    (newDate) => {
      if (newDate) {
        const formattedDate = newDate.format("DD-MM-YYYY");
        if (formattedDate !== selectedDate) {
          setSelectedDate(formattedDate);
        }
      }
    },
    [selectedDate]
  );

  useEffect(() => {
    dispatch(getEntriesByDate(selectedDate));
  }, [dispatch, selectedDate]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "roomNo", headerName: "Room No", width: 130 },
    { field: "cost", headerName: "Price", width: 100 },
    { field: "rate", headerName: "Rate", width: 100 },
    { field: "noOfPeople", headerName: "People", width: 100 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "modeOfPayment", headerName: "Payment Mode", width: 140 },
    { field: "checkInTime", headerName: "Check In", width: 130 },
    { field: "checkOutTime", headerName: "Check Out", width: 130 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "period", headerName: "Period", width: 110 },
    { field: "createDate", headerName: "Created At", width: 140 },
  ];

  return (
    <Box
      sx={{
        py: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" fontWeight={500} color="text.secondary">
          Select Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <DatePicker
            value={dayjs(selectedDate, "DD-MM-YYYY")}
            onChange={handleDateChange}
            format="DD-MM-YYYY"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                fullWidth
              />
            )}
          />
        </LocalizationProvider>
      </Stack>
      {loading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : (
        <DataGrid
          rows={entries}
          columns={columns}
          pageSize={5}
          sx={{ mt: 2, height: 400 }}
        />
      )}
    </Box>
  );
};

const DashboardPage = () => {
  const [pathname, setPathname] = useState("/dashboard");
  const [currentPage, setCurrentPage] = useState("dashboard");

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(path);
        setCurrentPage(path.replace("/", "")); // Extract segment from pathname
      },
    };
  }, [pathname]);

  useEffect(() => {
    setCurrentPage(pathname.replace("/", "")); // Sync currentPage when pathname changes
  }, [pathname]);

  const renderPageContent = () => {
    switch (currentPage) {
      case "manage-staff":
        return <RestStaffDashboard />;
      case "categories-expenses":
        return <Typography>Categories Page Content</Typography>;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout
        defaultSidebarCollapsed
        slots={{
          appTitle: () => (
            <Typography variant="h6">TGT Admin Dashboard</Typography>
          ),
        }}
        sidebarExpandedWidth={260}
        navigation={NAVIGATION}
      >
        {renderPageContent()}
      </DashboardLayout>
    </AppProvider>
  );
};

export default DashboardPage;
