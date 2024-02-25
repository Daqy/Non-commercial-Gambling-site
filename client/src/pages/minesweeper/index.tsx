import * as S from "./index.styles";
import { useSelector } from "react-redux";
import { authToken } from "~store/auth";
import Grid from "~components/sweeper/grid";
import GridItem from "~components/sweeper/gridItem";
import { useEffect, useState } from "react";
import { useValidation } from "@/utils/validation";
import { useBalance } from "@/stores/user";
import AppButton from "~components/button";
import { Informatics } from "@/components/informatics";
import axios from "axios";
import { getEarned, isBombTile, isWinningState, tileFlip } from "@/utils/game";
import { useDispatch } from "react-redux";
import { prettifyCurrency } from "@/utils/prettify";
import { updateBalance } from "~store/user";

export default function Minesweeper() {
  const [stake, setStake] = useState();
  const balance = useSelector(useBalance);
  const bombMultipliers = [1, 3, 5, 24];
  const [multiplierIndex, setMultiplierIndex] = useState(0);
  const [game, setGame] = useState({});
  const dispatch = useDispatch();

  const form = useValidation({
    stake: {
      $value: stake,
      isEmpty: {
        $validator: (value: number) => {
          return !!value;
        },
        $message: "Stake is required to create a game",
      },
      greaterThanZero: {
        $validator: (value: number) => {
          return value > 0;
        },
        $message: "Value must be greater than 0",
      },
      haveEnoughBalance: {
        $validator: (value: number) => {
          return value <= balance;
        },
        $message: "Your balance isn't high enough for this bet",
      },
    },
  });

  const preventAlphaKey = (event: any) => {
    const allowedValues = "1234567890".split("");
    if (!allowedValues.includes(event.key) && event.key !== "Backspace") {
      event.preventDefault();
    }
  };

  useEffect(() => {
    axios.get("/api/game/minesweeper/latest-game").then((response) => {
      setGame(response.data);
      // console.log(response);
    });
  }, []);

  const handleClick = (id: number) => {
    if (!game) return;
    axios
      .post(`/api/game/minesweeper/${game._id}/click`, {
        clickPosition: id + 1,
      })
      .then(async (response) => {
        if (!response.data?.bomb?.position) {
          setGame(response.data);
          return;
        }
        // const bombPositions = response.data.bomb.position;
        // setBomb([id + 1]);
        // response.data.bomb.position = [id + 1];
        // console.log(response.data);
        setGame(response.data);
      });
  };

  const createGame = (e) => {
    e.preventDefault();
    if (form.$anyInvalids) {
      form.$touch();
      return;
    }

    axios
      .post("/api/game/minesweeper/create", {
        BombCount: bombMultipliers[multiplierIndex],
        Stake: stake,
      })
      .then((response) => {
        axios
          .get(`/api/game/minesweeper/${response.data.InsertedID}`)
          .then((response) => {
            setGame(response.data);
            axios.get("/api/get-user").then(async (response) => {
              await dispatch(updateBalance(response.data.balance));
            });
          });
      });
  };

  const claimGame = (e) => {
    e.preventDefault();

    axios.post(`/api/game/minesweeper/${game._id}/claim`).then((response) => {
      setGame(response.data);
      axios.get("/api/get-user").then(async (response) => {
        await dispatch(updateBalance(response.data.balance));
      });
    });
  };
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
                  onClick={
                    game.state === "done" ? false : () => handleClick(index)
                  }
                />
              );
            })}
        </Grid>
      </S.gridContainer>
      <S.controlContainer>
        <S.controls>
          <S.input
            onKeyDown={preventAlphaKey}
            onChange={(e) => {
              setStake(Number(e.target.value));
              form.stake.$touch();
            }}
            validation={form.stake}
            placeholder="Enter your bet quantity..."
          />
          <S.bombSelectorContainer>
            {bombMultipliers.map((multiplier, index) => {
              return (
                <S.bombSelector
                  key={multiplier}
                  onClick={() => setMultiplierIndex(index)}
                  theme={{ selected: index === multiplierIndex }}
                >
                  {multiplier}
                </S.bombSelector>
              );
            })}
          </S.bombSelectorContainer>
          <AppButton
            theme={game?.state === "ongoing" ? "subtle" : "primary"}
            disabled={game?.state === "ongoing"}
            onClick={createGame}
          >
            Create Game
          </AppButton>
        </S.controls>
        <S.informaticsContainer>
          <Informatics game={game} />
          <S.claim>
            {game.state === "ongoing" ? (
              <AppButton theme="secondary" onClick={claimGame}>
                Claim {game ? `$${prettifyCurrency(game.pool)}` : ""}
              </AppButton>
            ) : isWinningState(game) ? (
              <S.winningClaim>
                Claimed ${prettifyCurrency(game.pool)}
              </S.winningClaim>
            ) : (
              <S.lostClaim>
                Lost a potential ${prettifyCurrency(game.pool)}
              </S.lostClaim>
            )}
          </S.claim>
        </S.informaticsContainer>
      </S.controlContainer>
    </S.container>
  );
}
