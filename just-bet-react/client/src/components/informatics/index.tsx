import { Icon } from "@iconify/react/dist/iconify.js";
import * as S from "./index.styles";
import CustomIcon from "@/assets/icons";
import Coin from "@/assets/icons/coin";
import { prettifyCurrency } from "@/utils/prettify";
import { getPercentageOfWining } from "@/utils/game";
import { useEffect, useState } from "react";

export function Informatics({ game }) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    if (Object.keys(game).length > 0) {
      const potentialPool = getPercentageOfWining(
        25,
        (game?.clicks?.length ?? 0) + 1,
        game.bomb.count
      );
      setClick((1 / potentialPool) * game.stake - game.pool);
    }
  }, [game.clicks]);

  return (
    <S.container>
      <S.item>
        <S.svgContainer>
          <Coin
            mainFill="--color-text-main"
            secondaryFill="--color-card-highlight"
          />
        </S.svgContainer>
        <S.text>{prettifyCurrency(game?.stake)}</S.text>
      </S.item>
      <S.item>
        <S.svgContainer>
          <Icon icon={CustomIcon.minesweeper} />
        </S.svgContainer>
        <S.text>{game?.bomb?.count ?? 0}</S.text>
      </S.item>
      <S.item>
        <S.svgContainer>
          <Icon icon={CustomIcon.click} />
        </S.svgContainer>
        <S.text>{prettifyCurrency(click)}</S.text>
      </S.item>
    </S.container>
  );
}
