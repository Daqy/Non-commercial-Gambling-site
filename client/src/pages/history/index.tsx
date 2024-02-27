import Grid from "@/components/sweeper/grid";
import GridItem from "@/components/sweeper/gridItem";
import { getEarned, isBombTile, isWinningState, tileFlip } from "@/utils/game";
import axios from "axios";
import { useEffect, useState } from "react";
import * as S from "./index.styles";
import { prettifyCurrency } from "@/utils/prettify";

export default function History() {
  const [games, setGames] = useState([]);
  const [game, setGame] = useState();
  const [selectedIndex, selectIndex] = useState(0);

  useEffect(() => {
    axios.get("/api/game/game-history").then((response) => {
      setGames(response.data.reverse());
      selectIndex(0);
      setGame(response.data[0]);
    });
  }, []);

  return (
    <S.container>
      <S.gridContainer>
        <Grid>
          {Array(25)
            .fill(null)
            .map((_, i) => i)
            .map((index) => {
              return (
                <GridItem
                  key={index}
                  isBomb={isBombTile(game, index + 1)}
                  flip={tileFlip(game, index + 1)}
                  earn={getEarned(game, index + 1)}
                  hasWon={isWinningState(game)}
                />
              );
            })}
        </Grid>
      </S.gridContainer>
      <S.rightContainer>
        <S.scroll>
          {games.map((game, index) => (
            <S.game
              key={index}
              theme={{ active: index === selectedIndex }}
              onClick={() => {
                selectIndex(index);
                setGame(games[index]);
              }}
            >
              <S.rightGrid>
                <Grid small={true}>
                  {Array(25)
                    .fill(null)
                    .map((_, i) => i)
                    .map((index) => {
                      return (
                        <GridItem
                          key={index}
                          hide={true}
                          isBomb={isBombTile(game, index + 1)}
                          flip={tileFlip(game, index + 1)}
                          earn={getEarned(game, index + 1)}
                          hasWon={isWinningState(game)}
                        />
                      );
                    })}
                </Grid>
              </S.rightGrid>
              <S.info>
                <h2>Game {index + 1}</h2>
                <p>stake ${game.stake}</p>
                <p>Bomb count ${game.bomb.count}</p>
                {/* <S.claimedValue> */}

                {/* </S.claimedValue> */}
              </S.info>
              {isWinningState(game) ? (
                <S.win>claimed ${prettifyCurrency(game.pool)}</S.win>
              ) : (
                <S.lost>lost ${prettifyCurrency(game.pool)}</S.lost>
              )}
            </S.game>
          ))}
        </S.scroll>
      </S.rightContainer>
    </S.container>
  );
}
