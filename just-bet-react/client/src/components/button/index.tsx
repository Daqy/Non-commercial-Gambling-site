import { Icon } from "@iconify/react/dist/iconify.js";
import * as S from "./index.styles";
import customIcons from "@/assets/icons";

export default function Button({
  children,
  theme = "primary",
  loading = false,
  disabled = false,
  ...atr
}: {
  children: string;
  theme?: S.Themes;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <S.button {...atr} $theme={theme} disabled={disabled}>
      {children}
      {loading ? <Icon icon={customIcons.loading} /> : <></>}
    </S.button>
  );
}
