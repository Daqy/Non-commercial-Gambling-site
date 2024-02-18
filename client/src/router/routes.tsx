// import Home from "../pages/index";
import Login from "~pages/login";
import Minesweeper from "~pages/minesweeper";

export const routes = [
  {
    path: "/login",
    name: "login",
    component: <Login />,
    meta: {
      hideDropdown: true,
    },
  },
  {
    path: "/minesweeper",
    name: "minesweeper",
    component: <Minesweeper />,
  },
  // { path: "/crash", name: "crash", component: <Crash /> },
];
