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

  if (loading) return null;

  return isAdminAuthenticated ? children : null;
};

export default ProtectedAdminRoute;