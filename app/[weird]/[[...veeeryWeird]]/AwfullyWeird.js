"use client"

import { useEffect, useState } from "react";
import { ContentBox, StyledPageContainer } from "../../../components/commonStyledElements";

export default function AwfullyWeird({ params: { weird, veeeryWeird } }) {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch("/api/thing")
            .then((res) => res.json())
            .then((someData) => {
                setData(someData);
            });
    }, []);
    return (
        <StyledPageContainer>
            <ContentBox>
                {typeof window === "undefined" && <div>is loading...</div>}
                <pre>
                    PATHNAME: {typeof window !== "undefined" && window.location.pathname}
                    {"\n"}
                    QUERY: {JSON.stringify({ weird, veeeryWeird }, null, 2)}
                </pre>
                {data == null ? (
                    <div>Awaiting data</div>
                ) : (
                    <div>{JSON.stringify(data, null, 2)}</div>
                )}
            </ContentBox>
        </StyledPageContainer>
    );
}
