import { useState } from "react";
import { useFloating } from '@floating-ui/react';

export default function PopperJSSample() {
  const [tooltipState, setTooltipState] = useState(null);
  const isTooltipVisible = tooltipState != null;
  const { refs, floatingStyles } = useFloating();

  return (
    <article>
      <h2>Floating UI</h2>
      <p>
        The simplest approach of using{" "}
        <a
          ref={tooltipState === 0 ? refs.setReference : null}
          href="https://floating-ui.com/docs/getting-started"
          target="_blank"
          rel="noreferrer"
        >
          PopperJs React Wrapper
        </a>
        .
        {isTooltipVisible && (
          <button
            ref={tooltipState === 1 ? refs.setReference : null}
            onClick={() => setTooltipState((prev) => (prev + 1) % 2)}
            type="button"
          >
            {tooltipState === 0 ? `Position it here` : "Back to the link"}
          </button>
        )}
      </p>
      <div>
        <button
          type="button"
          onClick={() => setTooltipState((prev) => (prev != null ? null : 0))}
        >
          {`${isTooltipVisible ? "Hide" : "Display"} `}Tooltip
        </button>
      </div>
      {isTooltipVisible && (
        <div ref={refs.setFloating} style={{
          backgroundColor: "white",
          border: "1px solid black",
          padding: "8px",
          boxSizing: "border-box",
          ...floatingStyles
        }}>
          <span> A cool library to handle overlay elements</span>:
          <pre>styles: {JSON.stringify(floatingStyles, null, 2)}</pre>
        </div>
      )}
    </article>
  );
}
