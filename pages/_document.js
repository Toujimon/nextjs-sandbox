import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

import { ServerStyleSheet } from "styled-components";

/*
It has neat comments given by the team that kind of motivate me to
go and investigate further into the depths of how this works.
 */
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    /* I CAN HAVE EVERYTHING! */
    const scSheets = new ServerStyleSheet();

    try {
      const initialProps = await Document.getInitialProps(ctx);
      const scStyleSheets = scSheets.getStyleElement();

      return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
          ...React.Children.toArray(initialProps.styles),
          scStyleSheets,
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
