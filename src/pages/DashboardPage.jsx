import { useEffect, useState, useMemo } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { createTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import dayjs from "dayjs";
import RestStaffDashboard from "../components/restaurant/RestStaffDashboard";
import HomeDashboard from "../components/HomeDashboard";
import GHDashboard from "../components/guest-house/GHDashboard";
import RestCategoryExpensesDashboard from "../components/restaurant/RestCategoryExpensesDashboard";
import CategoryIcon from "@mui/icons-material/Category";
import BadgeIcon from "@mui/icons-material/Badge";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
dayjs.locale("en-gb");

const NAVIGATION = [
  {
    segment: "home",
    title: "Home",
    icon: <DashboardIcon />,
  },
  { kind: "header", title: "Guest House" },
  {
    segment: "gh-dashboard",
    title: "GH-Dashboard",
    icon: <HotelIcon />,
  },
  { kind: "header", title: "Restaurant" },
  {
    segment: "res-dashboard",
    title: "Res-Dashboard",
    icon: <RestaurantIcon />,
  },
  { segment: "manage-staff", title: "Manage Staff", icon: <BadgeIcon /> },
  {
    segment: "categories-expenses",
    title: "Categories & Expenses",
    icon: <CategoryIcon />,
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

const DashboardPage = () => {
  const [pathname, setPathname] = useState("/dashboard");
  const [currentPage, setCurrentPage] = useState("");

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
    setCurrentPage(pathname.replace("/", ""));
  }, [pathname]);

  const renderPageContent = () => {
    switch (currentPage) {
      // Guest house
      case "gh-dashboard":
        return <GHDashboard />;
      // Restaurant
      case "res-dashboard":
        return <Typography>Restaurant Dashboard</Typography>;
      case "manage-staff":
        return <RestStaffDashboard />;
      case "categories-expenses":
        return <RestCategoryExpensesDashboard />;
      default:
        return <HomeDashboard />;
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
