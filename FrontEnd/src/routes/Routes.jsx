import { createBrowserRouter } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import AuthRoutes from "./AuthRoutes";

export default createBrowserRouter([AuthRoutes, MainRoutes]);
