import React from "react";
import { useState } from "react";
import MainLayout from "../components/mainLayout";

export default function ReplayCafeApp(props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  return (
    <MainLayout>
      <div>Replay cafe stuff</div>
    </MainLayout>
  );
}
