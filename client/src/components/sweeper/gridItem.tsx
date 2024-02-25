import * as S from "./gridItem.styles";
import BombTile from "./tiles/bomb";
import CashTile from "./tiles/cash";

export default function GridItem({
  isBomb = false,
  flip = false,
  earn,
  hasWon,
  onClick,
}) {
  return (
    <S.gridItem
      theme={{ flip, playable: !!onClick }}
      onClick={onClick ? onClick : () => {}}
    >
      <S.front></S.front>
      <S.back>
        {flip ? (
          isBomb ? (
            <BombTile hasWon={hasWon} />
          ) : (
            <CashTile earn={earn} />
          )
        ) : (
          <></>
        )}
      </S.back>
    </S.gridItem>
  );
}
