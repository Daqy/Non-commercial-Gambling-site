import { Outlet } from "react-router-dom";
import * as S from "./index.styles";
import Navbar from "~components/navbar/index";

export default function Login() {
  return (
    <S.container>
      <S.main>
        <Navbar />
        <Outlet />
      </S.main>
    </S.container>
  );
}
