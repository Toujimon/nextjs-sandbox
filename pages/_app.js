import React, { useMemo, useState } from "react";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as ScThemeProvider } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import ThemeTypeContext from "../src/themeTypeContext";
import { lightTheme, darkTheme } from "../src/theme";

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

  const [themeType, setThemeType] = useState("light");
  const themeTypeState = useMemo(() => {
    return {
      contextValue: {
        type: themeType,
        setType: (type) => setThemeType(type === "dark" ? "dark" : "light")
      },
      theme: themeType !== "dark" ? lightTheme : darkTheme
    };
  }, [themeType]);
  const { theme } = themeTypeState;

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
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <ThemeProvider theme={theme}>
        <ScThemeProvider theme={theme}>
          <ThemeTypeContext.Provider value={themeTypeState.contextValue}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeTypeContext.Provider>
        </ScThemeProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
