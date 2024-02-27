// import Home from "../pages/index";
import { Navigate } from "react-router-dom";
import Login from "~pages/login";
import Register from "~pages/register";
import Minesweeper from "~pages/minesweeper";
import History from "~pages/history";

export const routes = [
  {
    path: "/login",
    name: "login",
    component: <Login />,
    meta: {
      hideDropdown: true,
      noNavigateWhilstAuth: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: <Register />,
    meta: {
      hideDropdown: true,
      noNavigateWhilstAuth: true,
    },
  },
  {
    path: "/minesweeper",
    name: "minesweeper",
    component: <Minesweeper />,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/game-history",
    name: "history",
    component: <History />,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "",
    name: "catch",
    component: <Navigate to="/minesweeper" />,
    meta: {
      hideDropdown: true,
    },
  },
  // { path: "/crash", name: "crash", component: <Crash /> },
];
