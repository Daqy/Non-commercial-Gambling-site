import styled from "styled-components";
import { queries } from "@/utils/mediaQueries";

export const container = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${queries.tablet}) {
    flex-direction: row;
  }
`;

export const gridContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  &::after {
    content: "";
    position: absolute;
    height: 2px;
    width: calc(100% - 2rem);
    background: var(--color-card-highlight);
    bottom: 1px;
  }

  @media (min-width: ${queries.tablet}) {
    max-width: 50%;

    &::after {
      width: 2px;
      height: calc(100% - 2rem);
      right: 1px;
      top: 1rem;
    }
  }
`;

export const rightContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  padding: 2rem;
  max-height: 484px;

  @media (min-width: ${queries.tablet}) {
    max-width: 50%;
  }
`;

export const scroll = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* height: 100%; */
  height: calc(484px - 4rem);
`;

export const game = styled.div`
  width: 100%;
  /* background: red; */
  max-height: 150px;
  height: 150px;
  padding: 0.5rem;
  border-radius: 10px;
  border: 2px solid var(--color-card-highlight);
  display: flex;
  gap: 0.5rem;

  ${(props) =>
    props.theme.active
      ? "background: var(--color-card-highlight);box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;"
      : ""} /* height: 10%; */
  /* height: 100%; */
  /* height */
  &:hover {
    ${(props) => (props.theme.active ? "" : "cursor: pointer;")}
  }
`;

game.defaultProps = {
  theme: {
    active: false,
  },
};

export const rightGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  aspect-ratio: 1/1;

  /* width: 200px;
  height: 200px; */
`;

export const info = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  > h2 {
    color: white;
    font-size: 1.5rem;
  }
`;

export const win = styled.p`
  padding: 0.3rem 0.75rem;
  width: fit-content;
  height: fit-content;
  position: absolute;
  top: 0.5rem;
  color: black;
  right: 0.5rem;
  border-radius: 20px;
  background: var(--color-highlight-primary);
`;

export const lost = styled.p`
  position: absolute;
  padding: 0.3rem 0.75rem;
  right: 0.5rem;
  top: 0.5rem;
  height: fit-content;
  width: fit-content;
  color: black;
  border-radius: 20px;
  background: var(--color-bomb-background);
`;
