import styled from "styled-components";

export const tile = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-highlight-primary);

  p {
    color: var(--color-sweeper-dark);
    font-size: 1.2em;
  }
`;
