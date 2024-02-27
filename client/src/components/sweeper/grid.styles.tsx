import { queries } from "@/utils/mediaQueries";
import styled from "styled-components";

export const grid = styled.div`
  /* display: flex; */
  /* gap: 0.5rem; */
  /* flex-flow: row wrap; */
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: repeat(5, auto);
  /* padding: 2rem; */
  ${(props) =>
    props.theme.small
      ? `gap: 0.1rem;padding:0rem;`
      : `gap: 0.5rem;padding:2rem;`}

  @media (min-width: ${queries.mobile}) {
    /* grid-template-columns: repeat(5, 75px);
    grid-template-rows: repeat(5, 75px); */
  }
`;

grid.defaultProps = {
  theme: { small: false },
};
