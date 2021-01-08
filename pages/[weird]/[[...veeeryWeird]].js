import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../components/mainLayout";

export default function AwfullyWeird(...args) {
  const router = useRouter();
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/thing")
      .then((res) => res.json())
      .then((someData) => {
        setData(someData);
      });
  }, []);
  return (
    <MainLayout>
      {router.isFallback && <div>is loading...</div>}
      <pre>
        PATHNAME: {router.pathname}
        {"\n"}
        QUERY: {JSON.stringify(router.query, null, 2)}
      </pre>
      {data == null ? (
        <div>Awaiting data</div>
      ) : (
        <div>{JSON.stringify(data, null, 2)}</div>
      )}
    </MainLayout>
  );
}
