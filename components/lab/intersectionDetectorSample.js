import React, { useEffect, useRef, useState } from "react";

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
            console.log(
              `intersects: ${entry.isIntersecting} - ratio: ${entry.intersectionRatio}`
            );
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
        Trying to detect when the content is overflowing its parent or not using the <b>IntersectionObserver API</b>.
      </p>
      <div>
        <div
          css={`
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
          `}
        >
          <div>Fixed part</div>
          <div
            css={`
              position: relative;
              & > * {
                box-sizing: border-box;
                border: 1px solid orange;
              }
            `}
          >
            <div
              ref={containerRef}
              css={`
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
              `}
            >
              <div
                css={`
                  visibility: ${contentFits ? "visible" : "hidden"};
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
                `}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    css={`
                      white-space: nowrap;
                    `}
                  >
                    Item #{index + 1}
                  </div>
                ))}
              </div>
              <div
                ref={targetRef}
                css={`
                  visibility: ${contentFits ? "visible" : "hidden"};
                  white-space: nowrap;
                  position: relative;
                  &:hover::after {
                    content: "Something";
                    position: absolute;
                    top: 100%;
                    left: 0;
                  }
                `}
              >
                Some other fixed content
              </div>
            </div>
          </div>
          <div
            css={`
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              display: ${contentFits ? "none" : "block"};
            `}
          >
            Shows if main content doesn't fit
          </div>
        </div>
      </div>
    </article>
  );
}
