import { styled } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { ContentBox } from "../components/commonStyledElements";
import MainLayout from "../components/mainLayout";

const CatalogWrapper = styled("div")({
  overflow: "auto",
  maxHeight: "480px",
  maxWidth: "100%",
});

export default function ReplayCafeApp(props) {
  const [catalogState, setCatalogState] = useState({
    isFetching: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch("/api/bgcafe/catalogs").then((x) => x.json());
        setCatalogState({
          isFetching: false,
          data,
          error: null,
        });
      } catch (err) {
        setCatalogState({
          isFetching: false,
          data: null,
          error: err?.toString(),
        });
      }
    })();
  }, []);

  return (
    <MainLayout>
      <h1>Replay Cafe App</h1>
      <ContentBox>
        First of all, if you are at Madrid and like board games, don't forget to
        visit{" "}
        <b>
          <a
            href="https://www.replayoutletcafe.com/"
            target="_blank"
            referrer="none"
          >
            Replay Board Game Cafe
          </a>
        </b>
      </ContentBox>
      <ContentBox>
        <h2>Catalog processor</h2>
        <CatalogWrapper>
          {catalogState.data ?? catalogState.error
            ? JSON.stringify(catalogState.data ?? catalogState.error)
            : catalogState.isFetching
            ? "Loading data..."
            : "Introduce the catalog url"}
        </CatalogWrapper>
      </ContentBox>
    </MainLayout>
  );
}
