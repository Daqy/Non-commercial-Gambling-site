import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { routes } from "./routes";

export default function Router({
  defaultLayout = <Outlet />,
}: {
  defaultLayout?: JSX.Element;
}) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={defaultLayout}>
          {routes.map((route) => {
            return (
              <Route
                path={route.path}
                key={route.path}
                element={route.component}
              />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
