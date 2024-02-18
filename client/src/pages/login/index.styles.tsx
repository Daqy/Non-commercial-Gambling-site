import styled from "styled-components";

export const container = styled.div`
  height: 522px;
  display: flex;
  justify-content: center;
`;

export const inputContainer = styled.div`
  width: 50%;
  height: 100%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;

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
