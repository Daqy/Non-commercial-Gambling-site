import * as S from "./cash.styles";
import { prettifyCurrency } from "@/utils/prettify";

export default function Cash({ earn, hide = false }) {
  return <S.tile>{!hide ? <p>+{prettifyCurrency(earn)}</p> : <></>}</S.tile>;
}
