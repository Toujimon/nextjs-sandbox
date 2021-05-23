import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets as MuiServerStyleSheets } from "@material-ui/core/styles";

import { ServerStyleSheet } from "styled-components";

/* Shamelessly stolen from the code given in
https://github.com/mui-org/material-ui/tree/master/examples/nextjs

It has neat comments given by the team that kind of motivate me to
go and investigate further into the depths of how this works.
 */
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    /* I CAN HAVE EVERYTHING! */

    // Render app and page and get the context of the page with collected side effects.
    const muiSheets = new MuiServerStyleSheets();
    const scSheets = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            scSheets.collectStyles(muiSheets.collect(<App {...props} />))
        });

      const initialProps = await Document.getInitialProps(ctx);

      const muiStylesheets = muiSheets.getStyleElement();

      const scStyleSheets = scSheets.getStyleElement();

      return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
          ...React.Children.toArray(initialProps.styles),
          scStyleSheets,
          muiStylesheets
        ]
      };
    } finally {
      scSheets.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
