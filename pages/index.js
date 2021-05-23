import MainLayout from "../components/mainLayout";

export default function IndexPage() {
  return (
    <MainLayout>
      <div>
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
        <p>
          For starters, this project has{" "}
          <b>
            <a
              href="https://emotion.sh/docs/introduction"
              target="_blank"
              rel="noreferrer"
            >
              Emotion
            </a>
          </b>
          {", "}
          <b>
            <a
              href="https://styled-components.com/"
              target="_blank"
              rel="noreferrer"
            >
              Styled-Components
            </a>
          </b>{" "}
          and&nbsp;
          <b>
            <a href="https://material-ui.com/" target="_blank" rel="noreferrer">
              Material-UI
            </a>
          </b>{" "}
          JSS Styling solutions working at once... Just for the kick of seeing
          if they don't conflict TOO much.
          <br />
          Of course, they all are working server side.
        </p>
      </div>
      <div>
        I'm kind of liking the idea of the "out of the box" routing and the
        separation in "pages" (all of this is part of NextJs Framework), but I'm
        not loving how I need to either wrap the whole app on a layout
        component, or keep wrapping the content of each page on its own layout
        (many times the same one).
      </div>
    </MainLayout>
  );
}
