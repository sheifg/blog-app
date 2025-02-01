import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export default function PrivateRouter() {
  // check the current user from localstorage
  // More safety is sessionStorage, beacuse whenever you close the page, everything is cleared and you have to login again
  const currentUser = localStorage.getItem("user") || false;

  // if there is no currentUser
  if (!currentUser) {
    toast.warning("You need to login first");
    return <Navigate to="/auth/login" replace />;
  } else {
    return <Outlet />;
  }
}
