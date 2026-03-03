import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const auth = localStorage.getItem("auth");
  return auth ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;