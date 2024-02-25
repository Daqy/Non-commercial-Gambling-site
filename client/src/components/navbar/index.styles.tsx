import { queries } from "@/utils/mediaQueries";
import styled from "styled-components";

export const nav = styled.nav`
  background: var(--color-card-highlight);
  border-radius: 10px 10px 0px 0px;
  z-index: 1;
  max-height: 75px;
  height: 75px;
`;

export const container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  z-index: 2;
  color: var(--color-important-text);
  justify-content: space-between;
`;

const svgHeight = "2rem";

export const balance = styled.p`
  align-items: center;
  display: flex;

  > svg {
    width: ${svgHeight};
    height: ${svgHeight};
  }
`;

export const balanceText = styled.span`
  text-transform: uppercase;
  color: var(--color-text-main);
  display: none;

  @media (min-width: ${queries.tablet}) {
    display: flex;
  }
`;

export const balanceValue = styled.span`
  margin: 0 0.5rem;
  color: var(--color-important-text);
`;
