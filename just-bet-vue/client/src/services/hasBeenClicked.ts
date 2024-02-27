export function hasBeenClicked(id: number, clicks: any) {
  if (!clicks || clicks.length === 0) return false
  return (
    clicks.filter((click: { position: number; earned: number }) => click.position === id).length > 0
  )
}
