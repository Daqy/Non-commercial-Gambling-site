import * as S from "./index.styles";
import { routes } from "~router/routes";
import { useLocation } from "react-router-dom";

export default function Nav(props) {
  const location = useLocation();
  console.log(location);
  return (
    <S.nav>
      <S.dropdownContainer>
        <S.title>{prettifyTitle(location.pathname)}</S.title>
      </S.dropdownContainer>
    </S.nav>
  );
}

const prettifyTitle = (title: string) => {
  return title.replaceAll(/(\W?\d?)+/g, "");
};
