import styled from "styled-components";

export const gridItem = styled.div`
  /* width: 100%;
  height: 100%; */
  flex: 0 1 calc(20% - 0.4rem);
  aspect-ratio: 1/1;
  position: relative;
  border-radius: 5px;
  perspective: 1000px;
  transform-style: preserve-3d;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  cursor: default;

  ${(props) =>
    props.theme.flip ? "transition: all 1s;transform: rotateY(180deg);" : ""}

  &:hover {
    ${(props) => (props.theme.playable ? "cursor: pointer;" : "")}
  }
`;

gridItem.defaultProps = {
  theme: {
    flip: false,
  },
};

export const front = styled.div`
  backface-visibility: hidden;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  background: var(--color-sweeper-light);

  &::before {
    content: "";
    position: absolute;
    width: 150%;
    height: 100%;
    transform: rotate(45deg) translate(-10%, 68%);
    background-color: var(--color-sweeper-dark);
  }
`;

export const back = styled.div`
  backface-visibility: hidden;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  transform: rotateY(180deg);
`;

// .back {
//   transform: rotateY(180deg);
// }
// .front {
//   background: var(--color-card-main);

//   &::before {
//     content: '';
//     position: absolute;
//     width: 150%;
//     height: 100%;
//     transform: rotate(45deg) translate(-10%, 68%);
//     background-color: var(--color-card-highlight);
//   }
// }
