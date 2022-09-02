import React from "react";
import { useState } from "react";
import { ContentBox } from "../components/commonStyledElements";
import MainLayout from "../components/mainLayout";

export default function ReplayCafeApp(props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  return (
    <MainLayout>
      <ContentBox>Replay cafe stuff</ContentBox>
    </MainLayout>
  );
}
