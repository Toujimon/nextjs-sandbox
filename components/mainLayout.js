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

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  gap: theme.spacing(2),
}));

const StyledTopBanner = styled(({ textColor, background, ...rest }) => (
  <div {...rest} />
))(({ theme, background, textColor }) => ({
  ...(background
    ? { backgroundImage: `url(${background})`, backgroundSize: "cover" }
    : { backgroundColor: "transparent" }),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  textAlign: "center",
  ...(textColor ? { color: textColor } : null),
}));

const StyledAvatar = styled(Avatar)({
  width: 120,
  height: 120,
});

const HOME_SUBPATH = "/";
const tabsValues = [
  [HOME_SUBPATH, "Home"],
  ["/lab", "Lab"],
  ["/replay-cafe-app", "Replay Cafe App"],
  ["/bgg-explorer", "BGG Explorer"],
  ["/something", "Something"],
];

function getTabValue(pathname) {
  const [, subPath] = /^(\/\S+)(\/\S*)*$/.exec(pathname) ?? [];
  if (!subPath) {
    return tabsValues[0][0];
  }
  return tabsValues.find(([x]) => x === subPath)?.[0] ?? false;
}

export default function MainLayout({ children, title = defaultTitle }) {
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
      {tabValue === tabsValues[0][0] && (
        <StyledTopBanner background="/home-banner.jpg" textColor="white">
          <Typography gutterBottom variant="h3">
            Gonzalo Arrivi's Sandbox
          </Typography>
          <StyledAvatar src="/home-avatar.jpg" />
        </StyledTopBanner>
      )}
      <StyledContainer>{children}</StyledContainer>
    </>
  );
}
