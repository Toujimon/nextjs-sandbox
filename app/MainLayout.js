'use client'

import React, { useMemo } from "react";
import styled from "styled-components";
import { useRouter, usePathname } from "next/navigation";

const StyledAppBar = styled.header({
  position: "sticky",
  top: 0,
  right: 0,
  color: "#fff",
  backgroundColor: "#3f51b5",
  display: "flex",
  alignItems: "center",
  zIndex: 1100,
  width: "100%",
  boxShadow:
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
});

const StyledAppBarTabs = styled.div({
  flex: "0 0 auto",
  marginLeft: "auto",
  display: "flex",
  minHeight: "48px",
});

const Tab = styled(({ active, ...rest }) => <button  {...rest} />)((props) => ({
  fontSize: "0.875rem",
  textAlign: "center",
  fontFamily: "Roboto, Helvetica, Arial. sans-serif",
  fontWeight: "500",
  lineHeight: "1.75",
  whiteSpace: "normal",
  letterSpacing: "0.02857em",
  textTransform: "uppercase",
  backgroundColor: "transparent",
  color: "#fff",
  border: "2px solid transparent",
  minWidth: "120px",
  "&:hover:not(:disabled)": {
    cursor: "pointer",
  },
  ...(props.active && {
    borderBottomColor: "pink",
  }),
}));

const HOME_SUBPATH = "/";
const tabsValues = [
  [HOME_SUBPATH, "Home"],
  ["/resume", "Resume"],
  ["/lab", "Lab"],
];

function getTabValue(pathname) {
  const [, subPath] = /^(\/\S+)(\/\S*)*$/.exec(pathname) ?? [];
  if (!subPath) {
    return tabsValues[0][0];
  }
  return tabsValues.find(([x]) => x === subPath)?.[0] ?? false;
}

export default function MainLayout({
  children,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const tabValue = useMemo(
    () => getTabValue(pathname),
    [pathname]
  );

  return (
    <>
      <StyledAppBar>
        <StyledAppBarTabs>
          {tabsValues.map(([value, label]) => (
            <Tab
              key={value}
              type="button"
              disabled={value === tabValue}
              active={value === tabValue}
              onClick={() => router.push(value)}
            >
              {label}
            </Tab>
          ))}
        </StyledAppBarTabs>
      </StyledAppBar>
      {children}
    </>
  );
}
