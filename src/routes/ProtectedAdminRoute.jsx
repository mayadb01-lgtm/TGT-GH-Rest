import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { loading, isAdminAuthenticated } = useSelector((state) => state.admin);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAdminAuthenticated) {
        navigate("/admin-login", { state: { from: location }, replace: true });
      }
    }
  }, [loading, navigate, location, isAdminAuthenticated]);

  if (loading)
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>;
  return isAdminAuthenticated ? children : null;
};

export default ProtectedAdminRoute;
