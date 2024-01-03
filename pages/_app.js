import React from "react";
import Head from "next/head";

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
        <meta name="theme-color" content="#1976d2" />
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
      <Component {...pageProps} />
    </React.Fragment>
  );
}
