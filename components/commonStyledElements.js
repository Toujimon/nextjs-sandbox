'use client'

import styled from "styled-components";

export const ContentBox = styled.div`
  margin-top: 8px;
  padding: 16px;
  border: 1px solid rgba(0,0,0,0.5);
  border-radius: 4px;
  box-shadow: 2px 2px 4px ${({ theme }) => theme.primary};
`;

export const StyledPageContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  paddingLeft: "24px",
  paddingRight: "24px",
  "@media all and (min-width: 800px)": {
    paddingLeft: "72px",
    paddingRight: "72px",
  },
  "@media all and (min-width: 1200px)": {
    paddingLeft: "144px",
    paddingRight: "144px",
  },
});