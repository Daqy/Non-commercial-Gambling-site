import * as S from "./index.styles";

export default function Button({
  children,
  theme = "primary",
  ...atr
}: {
  children: string;
  theme: S.Themes;
}) {
  return (
    <S.button {...atr} $theme={theme}>
      {children}
    </S.button>
  );
}
