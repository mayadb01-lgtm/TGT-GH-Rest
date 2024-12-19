import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  }, [loading, navigate, location, isAuthenticated]);

  if (loading) return null;

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
