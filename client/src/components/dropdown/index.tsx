// import { routes } from "@/router/routes";
import * as S from "./index.styles";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import CustomIcons from "~assets/icons";

export default function Dropdown({
  show = false,
  teleportTo = undefined,
  routes = [],
  disabled = false,
  children,
}: {
  show?: boolean;
  teleportTo?: any;
  disabled?: boolean;
  routes: any;
  children: any;
}) {
  const [open, setOpen] = useState(show);

  return (
    <>
      <S.container>
        <S.navIcon>
          <Icon icon={CustomIcons[children]} />
        </S.navIcon>
        <S.title>{children}</S.title>
        {!disabled ? (
          <>
            <S.icon
              icon="iconamoon:arrow-up-2-light"
              theme={{ rotation: open ? "180deg" : "90deg" }}
            />
            <S.button onClick={() => setOpen(!open)}></S.button>
          </>
        ) : (
          <></>
        )}
      </S.container>

      {open ? (
        teleportTo ? (
          createPortal(
            <S.dropdown>
              {routes.map((route, index) => (
                <S.dropdownItem key={index}>{route}</S.dropdownItem>
              ))}
            </S.dropdown>,
            teleportTo.current
          )
        ) : (
          <S.dropdown>dropdown</S.dropdown>
        )
      ) : (
        <></>
      )}
    </>
  );
}
