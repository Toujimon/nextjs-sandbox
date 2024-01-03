import React from "react";
import Head from "next/head";
import { ThemeProvider as ScThemeProvider } from "styled-components";
import theme from "../src/theme";


export default function MyApp(props) {
  const { Component, pageProps } = props;

  return (
    <React.Fragment>
      <Head>
        <title key="title">
          My OWN page: This title should be overriden by any other given by the
          individual pages
        </title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <style>{`
          @font-face {
            font-family: "Roboto";
            src: url("/Roboto-Regular.ttf");
          }

          body {
            font-family: "Roboto", serif;
          }
        `}</style>
      </Head>
      <ScThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ScThemeProvider>
    </React.Fragment>
  );
}
