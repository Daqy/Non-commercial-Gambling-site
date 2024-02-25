export const tileFlip = (game, id: number) => {
  if (Object.keys(game).length === 0) return false;
  if (!game.clicks) return false;

  for (const click of game.clicks) {
    if (click.position === id) return true;
  }

  return isBombTile(game, id);
};

export const isBombTile = (game, id: number) => {
  if (Object.keys(game).length === 0) return false;
  if (!game.bomb.position) return false;

  for (const position of game.bomb?.position) {
    if (position === id) return true;
  }
  return false;
};

export const getEarned = (game, id: number) => {
  if (Object.keys(game).length === 0) return false;
  if (!game.clicks) return false;

  for (const click of game.clicks) {
    if (click.position === id) return click.earned;
  }

  return 0;
};

export const isWinningState = (game) => {
  if (Object.keys(game).length === 0) return false;
  if (!game.clicks) return false;
  if (!game.bomb.position) return false;

  return (
    game.clicks.filter((click) => game.bomb.position.includes(click.position))
      .length === 0
  );
};

export function getPercentageOfWining(size, nextClickCount, bombCount) {
  let total = 1;
  for (let index = 0; index < nextClickCount; index++) {
    total *= (size - bombCount - index) / (size - index);
  }
  return total;
}
