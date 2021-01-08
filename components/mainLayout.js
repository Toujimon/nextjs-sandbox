import {
  Container,
  AppBar,
  Tabs,
  Tab,
  styled,
  Typography,
  Avatar
} from "@material-ui/core";
import { useRouter } from "next/router";
import Head from "next/head";

export const defaultTitle = "My Own Test Site";

const StyledAppBar = styled(AppBar)({
  flexDirection: "row"
});

const StyledAppBarTabs = styled(Tabs)({
  flex: "0 0 auto",
  marginLeft: "auto"
});

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  gap: theme.spacing(2)
}));

const StyledTopBanner = styled("div")(({ theme, background, textColor }) => ({
  ...(background
    ? { backgroundImage: `url(${background})`, backgroundSize: "cover" }
    : { backgroundColor: "transparent" }),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  textAlign: "center",
  ...(textColor ? { color: textColor } : null)
}));

const StyledAvatar = styled(Avatar)({
  width: 120,
  height: 120
});

export default function MainLayout({ children, title = defaultTitle }) {
  const router = useRouter();
  const secondSegmentIndex = router.pathname.slice(1).indexOf("/");
  const subPath =
    secondSegmentIndex >= 0
      ? router.pathname.slice(0, secondSegmentIndex + 1)
      : router.pathname;
  return (
    <>
      <Head>
        <title key="title">{title}</title>
      </Head>
      <StyledAppBar position="sticky">
        <StyledAppBarTabs
          value={subPath}
          onChange={(e, newValue) => router.push(newValue)}
        >
          <Tab value="/" label="Home" />
          <Tab value="/about" label="About" />
          <Tab value="/advent-of-code" label="Advent of Code" />
          <Tab value="/something" label="Something" />
        </StyledAppBarTabs>
      </StyledAppBar>
      {subPath.length <= 1 && (
        <StyledTopBanner background="/home-banner.jpg" textColor="white">
          <Typography gutterBottom variant="h3">
            Gonzalo Arrivi's Sandbox
          </Typography>
          <StyledAvatar src="/home-avatar.jpeg" />
        </StyledTopBanner>
      )}
      <StyledContainer>
        <main>{children}</main>
      </StyledContainer>
    </>
  );
}
