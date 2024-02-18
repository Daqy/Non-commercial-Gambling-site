import * as S from "./index.styles";
import { routes } from "~router/routes";
import { useLocation } from "react-router-dom";
import Dropdown from "~components/dropdown";
import { prettifyTitle } from "@/utils/prettifyTitle";
import { useRef } from "react";

export default function Nav(props) {
  const location = useLocation();
  const navRef = useRef(null);

  const dropdownItems = routes
    .filter(
      (route) =>
        !location.pathname.includes(route.name) && !route.meta?.hideDropdown
    )
    .map((route) => route.name);

  const dropdownIsDisabled =
    routes.filter((route) => route.path === location.pathname)[0]?.meta
      ?.hideDropdown ?? false;

  return (
    <S.nav ref={navRef}>
      <S.container>
        <Dropdown
          teleportTo={navRef}
          routes={dropdownItems}
          disabled={dropdownIsDisabled}
        >
          {prettifyTitle(location.pathname)}
        </Dropdown>
      </S.container>
    </S.nav>
  );
}
