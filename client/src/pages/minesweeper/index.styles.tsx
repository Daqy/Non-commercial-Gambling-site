import { queries } from "@/utils/mediaQueries";
import styled from "styled-components";
import AppInput from "~components/input";

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

export const controlContainer = styled.div`
  flex-grow: 1;
  display: flex;
  padding: 2rem;
  flex-direction: column;
  gap: 2rem;
  max-width: 100%;
  /* min-width: 430px; */
  @media (min-width: ${queries.tablet}) {
    padding: 2rem 5rem;
    max-width: 50%;
    gap: 0rem;
  }
`;

export const input = styled(AppInput)`
  background: var(--color-card-subtle);
  border: 2px solid var(--color-card-subtle);
  color: white;
`;

export const controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  > * {
    min-height: 40px;
  }
`;

export const bombSelectorContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 10px;
  background: var(--color-card-subtle);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  overflow: hidden;
`;

export const bombSelector = styled.button`
  position: relative;
  background: none;
  border: none;
  font-size: 1rem;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-main);
  font-weight: bold;
  ${(props) =>
    props.theme.selected
      ? "box-shadow: rgb(0, 0, 0, 0.2) 3px 3px 6px 0px inset, rgba(0, 0, 0, 0.2) -3px -3px 6px 1px inset;"
      : ""}

  &:not(:last-child)::after {
    z-index: 1;
    position: absolute;
    content: "";
    background: #2d384b;
    width: 2px;
    height: 70%;
    top: 15%;
    right: -1px;
  }

  &:hover {
    cursor: pointer;
    background: var(--color-sweeper-light);
  }
`;

bombSelector.defaultProps = {
  theme: {
    selected: false,
  },
};

export const informaticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  /* justify-content: space-around; */
  align-items: center;
  /* justify-content: ; */
`;

export const claim = styled.div`
  margin-top: 1.5rem;
  width: 100%;
`;

export const winningClaim = styled.p`
  color: var(--color-highlight-primary);
  text-align: center;
  padding: 0.5rem 1rem;
`;

export const lostClaim = styled.p`
  color: var(--color-bomb-background);
  text-align: center;
  padding: 0.5rem 1rem;
`;
