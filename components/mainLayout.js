import React, { useMemo } from "react";
import scStyled from "styled-components";
import { useRouter } from "next/router";
import Head from "next/head";

export const defaultTitle = "My Own Test Site";

const StyledAppBar = scStyled.header({
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

const StyledAppBarTabs = scStyled.div({
  flex: "0 0 auto",
  marginLeft: "auto",
  display: "flex",
  minHeight: "48px",
});

const Tab = scStyled.button((props) => ({
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
  ":hover:not(:disabled)": {
    cursor: "pointer",
  },
  ...(props.active && {
    borderBottomColor: "pink",
  }),
}));

const StyledContainer = scStyled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
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
  title = defaultTitle,
  headerContent,
}) {
  const router = useRouter();
  const tabValue = useMemo(
    () => getTabValue(router.pathname),
    [router.pathname]
  );

  return (
    <>
      <Head>
        <title key="title">{title}</title>
      </Head>
      <StyledAppBar position="sticky">
        <StyledAppBarTabs
          value={tabValue}
          onChange={(e, newValue) => router.push(newValue)}
        >
          {tabsValues.map(([value, label]) => (
            <Tab
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
      {headerContent}
      <StyledContainer>{children}</StyledContainer>
    </>
  );
}
