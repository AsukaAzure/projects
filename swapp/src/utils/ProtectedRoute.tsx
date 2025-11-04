import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("user"); //checks the user

  if (!token) {
    toast.warning("Please log in to access this page",{ toastId: "auth-error" });
    return <Navigate to="/login" replace />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoutes;