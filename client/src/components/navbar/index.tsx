import * as S from "./index.styles";
import { routes } from "~router/routes";
import { useLocation } from "react-router-dom";
import Dropdown from "~components/dropdown";
import { prettifyCurrency, prettifyTitle } from "@/utils/prettify";
import { useRef } from "react";
import { useBalance, useUsername } from "@/stores/user";
import { useSelector } from "react-redux";
import CoinIcon from "~assets/icons/coin";

export default function Nav(props) {
  const location = useLocation();
  const navRef = useRef(null);
  const balance = useSelector(useBalance);
  const username = useSelector(useUsername);

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
        {username ? (
          <S.balance>
            balance: <span>{prettifyCurrency(balance)}</span>
            <CoinIcon />
          </S.balance>
        ) : (
          <></>
        )}
      </S.container>
    </S.nav>
  );
}
