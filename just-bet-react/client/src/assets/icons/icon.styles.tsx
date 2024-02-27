import styled from "styled-components";

export const coinSVG = styled.svg`
  .y {
    stroke: var(${(props) => props.theme.secondaryFill});
    stroke-miterlimit: 10;
  }
  .y,
  .a {
    fill: var(${(props) => props.theme.secondaryFill});
  }

  .ab {
    fill: var(${(props) => props.theme.mainFill});
  }
`;

coinSVG.defaultProps = {
  theme: { mainFill: "", secondaryFill: "" },
};
