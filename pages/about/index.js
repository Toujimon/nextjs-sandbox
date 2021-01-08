import Layout from "../../components/mainLayout";

const searchTerms = ["Fate/Zero", "Samidare", "Geass", "Evangelion"];

export async function getStaticProps() {
  const searchTerm =
    searchTerms[Math.floor(Math.random() * searchTerms.length)];
  const results = await fetch(
    `https://api.jikan.moe/v3/search/anime?q=${searchTerm}&page=1`
  )
    .then((fetchResult) => fetchResult.json())
    .then((jsonSomething) => jsonSomething.results);
  return {
    props: { searchTerm, searchResults: results }
  };
}

export default function ThisThing(props, ...moreThings) {
  return (
    <Layout>
      <img alt="surprised" src="/surprised-pikachu.png" />
      <p>This is my own about page!!</p>
      <p>
        The next elements have been fetched before the server returned the page
        data! (powered by the open{" "}
        <a href="https://jikan.moe/" target="_blank" rel="noreferrer">
          Jikan API
        </a>
        ) )
      </p>
      <p>
        Search term: <b>{props.searchTerm}</b>
      </p>
      <ul>
        {(props.searchResults || []).map((result) => (
          <li key={result.mal_id}>
            {result.title} ({result.type}){" "}
            <a href={result.url} target="_blank" rel="noreferrer">
              Link
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
