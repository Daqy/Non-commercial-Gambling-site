import styled from "styled-components";
import { Icon } from "@iconify/react";

export const container = styled.div`
  display: flex;
  align-items: center;
  /* height: 100%; */
  height: 75px;
`;

export const button = styled.button`
  background: none;
  color: var(--color-important-text);
  border: none;
  cursor: pointer;
  position: absolute;
  inset: 0;
`;

export const dropdown = styled.div`
  position: absolute;
  background: var(--color-card-highlight);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  top: 100%;
  padding: 0.5rem 0;
  border-radius: 0px 0px 10px 10px;
`;

export const dropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  min-width: 250px;
  text-transform: capitalize;

  &:hover {
    cursor: pointer;
    background: var(--color-card-highlight-hover);
  }

  &:not(:last-child)::after {
    content: "";
    width: 90%;
    height: 2px;
    background: var(--color-text-subtle);
    position: absolute;
    left: 5%;
    z-index: 1;
    bottom: -1px;
  }
`;

export const icon = styled(Icon)`
  height: 1.5rem;
  width: 1.5rem;
  transform: rotate(${(props) => props.theme.rotation});
  margin-left: 0.5rem;
  transition: transform 0.3s;
`;

icon.defaultProps = {
  theme: { rotation: "90deg" },
};

export const navIcon = styled.div`
  height: 45%;
  aspect-ratio: 1/1;
  margin-right: 0.5rem;

  > svg {
    width: 100%;
    height: 100%;
  }
`;

export const title = styled.span`
  text-transform: capitalize;
  font-size: 1.5rem;
`;
