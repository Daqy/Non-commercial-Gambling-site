import styled from "styled-components";

export const label = styled.label`
  display: flex;
  align-items: start;
  color: var(--color-important-text);
  text-transform: capitalize;
  gap: 0.2rem;
  width: 100%;

  ${(props) =>
    props.theme.inline ? "flex-direction: row;" : "flex-direction: column;"}
`;

label.defaultProps = {
  theme: { inline: false },
};

export const input = styled.input`
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  width: 100%;
  color: black;
  font-size: 1em;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  ${(props) =>
    props.theme.error
      ? "border: 2px solid var(--color-error) !important"
      : "border: 2px solid white"}
`;

input.defaultProps = {
  theme: { error: false },
};

export const errorMessage = styled.span`
  color: var(--color-error);
  font-size: 0.8rem;
`;
