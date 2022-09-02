import { ContentBox } from "../components/commonStyledElements";
import MainLayout from "../components/mainLayout";

export default function IndexPage() {
  return (
    <MainLayout>
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
