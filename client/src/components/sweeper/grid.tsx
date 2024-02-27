import * as S from "./grid.styles";

export default function Grid({ children, small = false }) {
  return <S.grid theme={{ small }}>{children}</S.grid>;
}
