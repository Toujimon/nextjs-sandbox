import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 100%;
  border: 1px solid black;
  display: grid;
  grid-template: 64px / 250px 1fr;
  position: relative;
  gap: 8px;
  & > * {
    box-sizing: border-box;
    border: 1px solid red;
  }
`;

const StyledObservedContainer = styled.div`
position: relative;
& > * {
  box-sizing: border-box;
  border: 1px solid orange;
}
`;

const StyledDisappearingBlock = styled.div`
position: absolute;
top: 0;
right: 0;
bottom: 0;
display: ${({ contentFits }) => contentFits ? "none" : "block"};
`;

const StyledMenuContainer = styled.div`
position: absolute;
height: 100%;
width: 100%;
display: grid;
grid-template: 100% / 1fr auto;
gap: 8px;
& > * {
  box-sizing: border-box;
  border: 1px solid green;
}
`;

const StyledMenu = styled.div`
visibility: ${({ contentFits }) => contentFits ? "visible" : "hidden"};
justify-self: center;
height: 100%;
display: grid;
grid-template-rows: 1fr;
grid-auto-flow: column;
grid-auto-columns: min-content;
gap: 8px;
& > * {
  box-sizing: border-box;
  border: 1px solid blue;
}
`;

const StyledFixedContent = styled.div`
visibility: ${({ contentFits }) => contentFits ? "visible" : "hidden"};
white-space: nowrap;
position: relative;
&:hover::after {
  content: "Something";
  position: absolute;
  top: 100%;
  left: 0;
}
`;

const StyledMenuItem = styled.div`
white-space: nowrap;
`;

export default function IntersectionDetectorSample() {
  const [contentFits, setContentFits] = useState(true);
  const targetRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && targetRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) {
            setContentFits(entry.isIntersecting);
          }
        },
        {
          root: containerRef.current,
          threshold: 1,
        }
      );
      observer.observe(targetRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <article>
      <h2>Intersection Detector</h2>
      <p>
        Trying to detect when the content is overflowing its parent or not using
        the <b>IntersectionObserver API</b>.
      </p>
      <div>
        <StyledContainer>
          <div>Fixed part</div>
          <StyledObservedContainer>
            <StyledMenuContainer
              ref={containerRef}
            >
              <StyledMenu
                contentFits={contentFits}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <StyledMenuItem
                    key={index}
                  >
                    Item #{index + 1}
                  </StyledMenuItem>
                ))}
              </StyledMenu>
              <StyledFixedContent
                ref={targetRef}
                contentFits={contentFits}
              >
                Some other fixed content
              </StyledFixedContent>
            </StyledMenuContainer>
          </StyledObservedContainer>
          <StyledDisappearingBlock
            contentFits={contentFits}
          >
            Shows if main content doesn't fit
          </StyledDisappearingBlock>
        </StyledContainer>
      </div>
    </article >
  );
}
