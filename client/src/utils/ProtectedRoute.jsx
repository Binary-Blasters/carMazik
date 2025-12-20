import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useSelector((state) => state.auth);

  // Redux se lo
  let { user, token } = auth;

  // 🔁 Fallback: Page refresh ke baad
  if (!token) token = localStorage.getItem("token");
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }
  }


  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
