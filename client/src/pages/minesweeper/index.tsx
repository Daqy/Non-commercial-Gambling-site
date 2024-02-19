import { useSelector } from "react-redux";
import { authToken } from "~store/auth";

export default function Minesweeper() {
  const token = useSelector(authToken);
  console.log(authToken);
  console.log(token);
  return <>minesweeper</>;
}
