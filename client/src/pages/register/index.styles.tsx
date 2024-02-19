import styled from "styled-components";
import { queries } from "@/utils/mediaQueries";

export const container = styled.div`
  height: fit-content;
  display: flex;
  justify-content: center;

  @media (min-width: ${queries.desktop}) {
    height: 522px;
  }
`;

export const inputContainer = styled.div`
  height: 100%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  width: 100%;

  @media (min-width: ${queries.mobile}) {
    width: 80%;
  }

  @media (min-width: ${queries.tablet}) {
    padding: 5rem;
  }

  @media (min-width: ${queries.desktop}) {
    width: 50%;
  }

  > form {
    width: 100%;
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }
`;

export const register = styled.p`
  width: 100%;
  text-align: center;

  > a {
    color: var(--color-important-text);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
