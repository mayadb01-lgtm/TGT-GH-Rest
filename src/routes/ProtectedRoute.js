import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  if (loading === false) {
    if (!isAuthenticated) {
      navigate("/login");
      return null;
    }
    return children;
  }
};

export default ProtectedRoute;
