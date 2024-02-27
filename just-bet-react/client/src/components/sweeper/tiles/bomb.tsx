import * as S from "./bomb.styles";
import { Icon } from "@iconify/react/dist/iconify.js";
import CustomIcon from "@/assets/icons";

export default function Bomb({ hasWon }) {
  return (
    <S.tile theme={{ hasWon }}>
      <Icon icon={CustomIcon.minesweeper} />
    </S.tile>
  );
}
