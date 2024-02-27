import styled from "styled-components";

export const title = styled.h1`
  text-transform: uppercase;
  margin: 1rem 0px;
  font-size: 2rem;
  color: var(--color-important-text);
`;

export const colorText = styled.span`
  color: var(--color-highlight-primary);
  margin-right: 8px;

  &::after {
    position: absolute;
    content: "";
    width: 5px;
    height: 5px;
    background-color: var(--color-highlight-primary);
    top: 50%;
    transform: translate(0%, 0%) rotate(45deg);
  }
`;
