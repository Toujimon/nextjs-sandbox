"use client"

import { useState, useEffect } from "react";
import { ContentBox, StyledPageContainer } from "../../components/commonStyledElements";

const labSamples = [
    "popperJs",
    "relevantContent",
    "intersectionDetector",
    "timeoutTester",
    "dynamicImageLoading",
    "numberAnimation"
];

export default function Lab() {
    const [samples, setSamples] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const sampleModules = await Promise.all(
                    labSamples.map((name) => import(`../../components/lab/${name}.js`))
                );
                setSamples(sampleModules.map((module) => module.default));
            } catch (e) {
                console.error(e);
                setSamples([]);
            }
        })();
    }, []);

    return (
        <StyledPageContainer>
            <p>
                Simple space for playing around with different features. All the samples
                here have been loaded dynamically.
            </p>
            {samples.map((Sample, index) => (
                <ContentBox>
                    <Sample />
                </ContentBox>
            ))}
        </StyledPageContainer>
    );
}
