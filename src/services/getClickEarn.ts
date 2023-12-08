export function getClickEarn(id: number, game: any) {
  const clickValue = game?.clicks?.filter(
    (click: { position: number; earned: number }) => click.position === id
  )
  return clickValue[0]?.earned || 0
}
