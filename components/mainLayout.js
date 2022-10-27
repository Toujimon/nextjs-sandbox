import React, { useContext, useMemo } from "react";
import {
  Container,
  AppBar,
  Tabs,
  Tab,
  styled,
  Typography,
  Avatar,
} from "@material-ui/core";
import { useRouter } from "next/router";
import Head from "next/head";

export const defaultTitle = "My Own Test Site";

const StyledAppBar = styled(AppBar)({
  flexDirection: "row",
});

const StyledAppBarTabs = styled(Tabs)({
  flex: "0 0 auto",
  marginLeft: "auto",
});

const StyledContainer = styled("div")(({ theme }) => ({
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
            <Tab key={value} value={value} label={label} />
          ))}
        </StyledAppBarTabs>
      </StyledAppBar>
      {headerContent}
      <StyledContainer>{children}</StyledContainer>
    </>
  );
}
