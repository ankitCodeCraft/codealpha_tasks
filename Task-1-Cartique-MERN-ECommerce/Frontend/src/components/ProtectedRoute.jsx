import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return userInfo ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
