import styled from "styled-components";

export const container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

export const item = styled.div`
  width: 25%;
  height: 96px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background: var(--color-card-subtle);
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const svgContainer = styled.div`
  width: 100%;
  height: 50%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-info-svg);

  svg {
    height: 75%;
    width: auto;
  }
`;

export const text = styled.p`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
