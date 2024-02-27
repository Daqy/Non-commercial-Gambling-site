import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { routes } from "./routes";
import { useSelector, useDispatch } from "react-redux";
import { updateUsername, updateBalance, useUsername } from "~store/user";
import axios from "axios";
import { useEffect } from "react";

export default function Router({
  defaultLayout = <Outlet />,
}: {
  defaultLayout?: JSX.Element;
}) {
  const isAuth = !!useSelector(useUsername);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuth) return;
    axios
      .get("/api/get-user")
      .then(async (response) => {
        await dispatch(updateUsername(response.data.username));
        await dispatch(updateBalance(response.data.balance));
      })
      .catch(async () => {
        await dispatch(updateUsername(""));
        await dispatch(updateBalance(0));
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={defaultLayout}>
          {routes.map((route) => {
            if (isAuth && route.meta.noNavigateWhilstAuth) {
              return (
                <Route
                  path={route.path}
                  key={route.path}
                  element={<Navigate to="/minesweeper" />}
                />
              );
            }
            if (isAuth || !route.meta.authRequired) {
              return (
                <Route
                  path={route.path}
                  key={route.path}
                  element={route.component}
                />
              );
            }
            return (
              <Route
                path={route.path}
                key={route.path}
                element={<Navigate to="/login" />}
              />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
