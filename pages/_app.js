import React, { useMemo, useState } from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as ScThemeProvider } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import { lightTheme as theme } from "../src/theme";

/* Shamelessly stolen from the code given in
https://github.com/mui-org/material-ui/tree/master/examples/nextjs
 */
export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.

    /* **Material-UI** is the one that injects the <style> element
    with this specific id  */
    const muiJssStyles = document.querySelector("#jss-server-side");
    if (muiJssStyles) {
      muiJssStyles.parentElement.removeChild(muiJssStyles);
    }

    /* Styled Components injected styles... don't need to be
    removed. It seems styled-components will now what to do with it */
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Head>
        <title key="title">
          My OWN page: This title should be overriden by any other given by the
          individual pages
        </title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <ThemeProvider theme={theme}>
        <ScThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <Component {...pageProps} />
        </ScThemeProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
