import styled from "styled-components";

const themes = {
  primary: {
    main: `border: 2px solid var(--color-highlight-primary); color: var(--color-highlight-primary); border-radius: 0.7rem;`,
    hover: `background: var(--color-highlight-primary); color: var(--color-highlight-primary-hover);`,
  },
};

export type Themes = keyof typeof themes;

export const button = styled.button<{ $theme: Themes }>`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  ${(props) => themes[props.$theme].main}

  &:hover {
    cursor: pointer;
    ${(props) => themes[props.$theme].hover}
  }
`;
