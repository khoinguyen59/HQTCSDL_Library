import { lazy } from "react";
import Loadable from "./../ui-component/Loadable";

const Login = Loadable(lazy(() => import("../pages/Auth/Login")));

const AuthRoutes = {
  path: "/login",
  element: <Login />
};

export default AuthRoutes;
