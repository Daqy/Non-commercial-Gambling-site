export function truncate<Number>(value: number, point: number) {
  if (value.toString().includes("."))
    return Number(
      value.toString().slice(0, value.toString().indexOf(".") + point)
    );
  return value;
}
