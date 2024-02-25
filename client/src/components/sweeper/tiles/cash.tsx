import * as S from "./cash.styles";
import { prettifyCurrency } from "@/utils/prettify";

export default function Cash({ earn }) {
  return (
    <S.tile>
      <p>+{prettifyCurrency(earn)}</p>
    </S.tile>
  );
}
