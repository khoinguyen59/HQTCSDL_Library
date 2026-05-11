import { Assessment, Home, PlayCircle } from "@mui/icons-material";

const Homepage = {
  id: "general",
  title: "HQTCSDL Library",
  type: "group",
  children: [
    {
      id: "home",
      title: "Home",
      type: "item",
      url: "/",
      icon: <Home />,
      breadcrumbs: false,
    },
    {
      id: "hqtcsdl",
      title: "HQTCSDL Dashboard",
      type: "item",
      url: "/hqtcsdl",
      icon: <Assessment />,
      breadcrumbs: false,
    },
    {
      id: "hqtcsdl-actions",
      title: "HQTCSDL Actions",
      type: "item",
      url: "/hqtcsdl/actions",
      icon: <PlayCircle />,
      breadcrumbs: false,
    },
  ],
};

export default Homepage;
