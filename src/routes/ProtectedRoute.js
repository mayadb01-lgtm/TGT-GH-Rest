import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { loading: userLoading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const { loading: adminLoading, isAdminAuthenticated } = useSelector(
    (state) => state.admin
  );
  const navigate = useNavigate();
  const location = useLocation();

  const loading = userLoading || adminLoading;

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && requiredRole === "User") {
        navigate("/login", { state: { from: location }, replace: true });
      } else if (!isAdminAuthenticated && requiredRole === "Admin") {
        navigate("/admin-login", { state: { from: location }, replace: true });
      } else if (requiredRole === "Admin" && isAdminAuthenticated) {
        navigate("/admin", { replace: true });
      } else if (requiredRole === "User" && isAuthenticated) {
        navigate("/", { replace: true });
      }
    }
  }, [
    loading,
    requiredRole,
    navigate,
    location,
    isAuthenticated,
    isAdminAuthenticated,
  ]);

  if (loading) return null;

  return isAuthenticated || isAdminAuthenticated ? children : null;
};

export default ProtectedRoute;
