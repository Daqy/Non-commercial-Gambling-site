import * as S from "./index.styles";
import Navbar from "~components/navbar/index";
import Logo from "../Logo";
import axios from "axios";
import { updateUsername, updateBalance, useUsername } from "~store/user";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button";
import { setToken } from "~store/auth";
import { useNavigate, Outlet } from "react-router-dom";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector(useUsername);

  const logout = () => {
    axios
      .post("/auth/logout")
      .then(async (response) => {
        await dispatch(updateUsername(""));
        await dispatch(updateBalance(0));
        await dispatch(setToken(""));
      })
      .finally(() => {
        navigate("/login");
      });
  };

  return (
    <S.container>
      <S.header>
        <Logo title="Just bet" />
      </S.header>
      <S.main>
        <Navbar />
        <Outlet />
      </S.main>
      <S.footer>
        {username ? (
          <>
            Username: {username} |
            <Button theme={"text"} onClick={logout}>
              logout
            </Button>
          </>
        ) : (
          <></>
        )}
        <S.copyright>© 2023 Daqy Develops & Co</S.copyright>
      </S.footer>
    </S.container>
  );
}
