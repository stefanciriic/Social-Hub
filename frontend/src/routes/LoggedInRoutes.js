import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Login } from "../pages/login/Login";

export default function LoggedInRoutes() {
  const user = useSelector((state) => state.user);
  return user ? <Outlet /> : <Login />;
}
