import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EntryPage from "./pages/EntryPage";
import DashboardPage from "./pages/DashboardPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import { useLayoutEffect } from "react";
import Store from "./redux/store.js";
import { loadUser } from "./redux/actions/userAction.js";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminSignupPage from "./pages/AdminSignupPage.jsx";
import { loadAdmin } from "./redux/actions/adminAction.js";
import { getUnPaidEntries } from "./redux/actions/entryAction.js";
import AdminResetPasswordPage from "./pages/AdminResetPasswordPage.jsx";
import UserResetPasswordPage from "./pages/UserResetPasswordPage.jsx";
import "./App.css";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useDemoRouter } from "@toolpad/core/internal";
import DashboardIcon from "@mui/icons-material/Dashboard";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
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

const App = () => {
  const { loading: userLoading } = useSelector((state) => state.user);
  const { loading: adminLoading } = useSelector((state) => state.admin);
  const router = useDemoRouter("/dashboard");

  useLayoutEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadAdmin());
    Store.dispatch(getUnPaidEntries());
  }, []);

  if (userLoading || adminLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
          padding: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <EntryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Navbar />
                <EntryPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedAdminRoute>
                <Navbar />
                <DashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<UserResetPasswordPage />} />
          {/* Admin */}
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin-signup" element={<AdminSignupPage />} />
          <Route
            path="/admin-reset-password"
            element={<AdminResetPasswordPage />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AppProvider>
  );
};

export default App;
