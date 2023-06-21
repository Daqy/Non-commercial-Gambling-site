export function hasBeenClicked(id: number, game: any) {
  return (
    game?.clicks.filter((click: { position: number; earned: number }) => click.position === id)
      .length > 0
  )
}
