import { queries } from "@/utils/mediaQueries";
import styled from "styled-components";

export const grid = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-flow: row wrap;
  flex-grow: 1;
  /* grid-template-columns: repeat(5, 50px);
  grid-template-rows: repeat(5, 50px); */
  padding: 2rem;

  @media (min-width: ${queries.mobile}) {
    /* grid-template-columns: repeat(5, 75px);
    grid-template-rows: repeat(5, 75px); */
  }
`;
