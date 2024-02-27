import * as S from "./index.styles";

export default function Logo({ title }) {
  const { start, end } = Object.fromEntries(
    title
      ?.split(" ")
      .map((section, index) => [index === 0 ? "start" : "end", section])
  );
  return (
    <S.title>
      <S.colorText>{start}</S.colorText>
      {end}
    </S.title>
  );
}
