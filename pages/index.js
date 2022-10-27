import {
  styled,
  Typography,
  Avatar,
} from "@material-ui/core";
import { ContentBox } from "../components/commonStyledElements";
import MainLayout from "../components/mainLayout";

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

export default function IndexPage() {
  return (
    <MainLayout
      headerContent={
        <StyledTopBanner background="/home-banner.jpg" textColor="white">
          <Typography gutterBottom variant="h3">
            Gonzalo Arrivi's Sandbox
          </Typography>
          <StyledAvatar src="/home-avatar.jpg" />
        </StyledTopBanner>
      }
    >
      <ContentBox>
        Hello World.
        <p>
          My{" "}
          <a
            href="https://nextjs.org/docs/getting-started"
            target="_blank"
            rel="noreferrer"
          >
            NextJs
          </a>{" "}
          Sandbox just to understand how some stuff works.
        </p>
      </ContentBox>
      <ContentBox>
        I'm kind of liking the idea of the "out of the box" routing and the
        separation in "pages" (all of this is part of NextJs Framework), but I'm
        not loving how I need to either wrap the whole app on a layout
        component, or keep wrapping the content of each page on its own layout
        (many times the same one).
      </ContentBox>
    </MainLayout>
  );
}
