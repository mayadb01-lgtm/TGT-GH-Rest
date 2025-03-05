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
import BarChartIcon from "@mui/icons-material/BarChart";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import GHSalesDashboard from "../components/guest-house/GHSalesDashboard";
dayjs.locale("en-gb");

const NAVIGATION = [
  {
    segment: "home",
    title: "Home",
    icon: <DashboardIcon />,
  },
  { kind: "header", title: "Guest House" },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "sales-report",
        title: "Sales Report",
        icon: <MonetizationOnOutlinedIcon />,
      },
    ],
  },
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
  const [segments, setSegments] = useState([]);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(path);
        setSegments(path.replace("/dashboard", "").split("/").filter(Boolean));
      },
    };
  }, [pathname]);

  useEffect(() => {
    setSegments(pathname.replace("/dashboard", "").split("/").filter(Boolean));
  }, [pathname]);

  const renderPageContent = () => {
    if (segments.length === 0) return <HomeDashboard />;

    switch (segments[0]) {
      case "gh-dashboard":
        return <GHDashboard />;
      case "reports":
        if (segments[1] === "sales-report") {
          return <GHSalesDashboard />;
        }
        return <Typography>Reports Overview</Typography>;
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
