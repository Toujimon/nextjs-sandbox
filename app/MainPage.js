'use client'

import styled from "styled-components";
import { ContentBox, StyledPageContainer } from "../components/commonStyledElements";

const StyledTopBanner = styled.div(({ $background, $textColor }) => ({
    ...($background
        ? { backgroundImage: `url(${$background})`, backgroundSize: "cover" }
        : { backgroundColor: "transparent" }),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    textAlign: "center",
    marginBottom: "24px",
    ...($textColor ? { color: $textColor } : null),
}));

const StyledAvatar = styled.img({
    borderRadius: "100%",
    objectFit: "cover",
    width: 120,
    height: 120,
});

export default function MainPage() {
    return (
        <>
            <StyledTopBanner $background="/home-banner.jpg" $textColor="white">
                <h1>
                    Gonzalo Arrivi's Sandbox
                </h1>
                <StyledAvatar src="/home-avatar.jpg" />
            </StyledTopBanner>
            <StyledPageContainer>
                <ContentBox>
                    Hello World.
                    <p>
                        My{" "}
                        <a
                            href="https://nextjs.org/docs/getting-started"
                            target="_blank"
                            rel="noreferrer"
                        >
                            NextJs
                        </a>{" "}
                        Sandbox just to understand how some stuff works.
                    </p>
                </ContentBox>
                <ContentBox>
                    <span>2026/06/19</span>
                    <p>I have the next pending stuff to do for this site:</p>
                    <ul>
                        <li>Upgrade NextJS to its latest version.</li>
                        <li>Check another dependencies for new versions.</li>
                        <li>Add google login for the small financials app.</li>
                    </ul>
                </ContentBox>
            </StyledPageContainer>
        </>
    );
}
