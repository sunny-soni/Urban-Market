import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return isAuthenticated && role != "admin" ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
