import { lazy } from "react";
import Loadable from "./../ui-component/Loadable";
import ProtectedRoute from "./ProtectedRoute";

const Structure = Loadable(lazy(() => import("../layout/Structure.jsx")));
const HomePage = Loadable(lazy(() => import("./../pages/Home/Home")));
const HQTCDashboard = Loadable(lazy(() => import("../pages/HQTCSDL/Dashboard")));
const HQTCActions = Loadable(lazy(() => import("../pages/HQTCSDL/Actions")));
const ErrorPage = Loadable(lazy(() => import("./../pages/ErrorPage")));

const MainRoutes = {
  path: "/",
  element: <Structure />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/stat",
      element: <HQTCDashboard />,
    },
    {
      path: "/hqtcsdl",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <HQTCDashboard />,
        },
        {
          path: "actions",
          element: <HQTCActions />,
        },
      ],
    },
  ],
};

export default MainRoutes;
