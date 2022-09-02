import React from "react";
import { useState } from "react";
import { ContentBox } from "../components/commonStyledElements";
import MainLayout from "../components/mainLayout";

export default function BggExplorer(props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleSearch = (ev) => {
    ev.preventDefault();

    const url = new URL("https://www.boardgamegeek.com/xmlapi2/search");
    url.searchParams.append("query", query);
    url.searchParams.append("type", "boardgame");
    console.log("is this happening?");
    setIsFetching(true);
    fetch(url.toString())
      .then((response) => response.text())
      .then((responseText) => {
        const parser = new DOMParser();
        const resultsDocument = parser.parseFromString(
          responseText,
          "application/xml"
        );
        const items = [];
        resultsDocument.querySelectorAll("item").forEach((element) => {
          items.push({
            id: element.getAttribute("id"),
            name: element.querySelector("name")?.getAttribute("value"),
            yearPublished: element
              .querySelector("yearpublished")
              ?.getAttribute("value"),
          });
        });
        setResults(items);
      })
      .finally(() => setIsFetching(false));
  };
  return (
    <MainLayout>
      <ContentBox>
        <h3>Search</h3>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            onChange={(ev) => setQuery(ev.target.value)}
            value={query}
            disabled={isFetching}
          />
          <button type="submit" disabled={isFetching}>
            Search
          </button>
        </form>
        {!isFetching ? (
          <>
            <h4>Results: {results.length}</h4>
            <ul>
              {results.map((game) => (
                <li key={game.id}>
                  {`[${game.id}] ${game.name} (${game.yearPublished})`}{" "}
                  <a
                    target="blank"
                    rel="noreferrer"
                    href={`https://boardgamegeek.com/boardgame/${game.id}`}
                  >
                    Link
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Searching...</p>
        )}
      </ContentBox>
    </MainLayout>
  );
}
