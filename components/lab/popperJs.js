import { useState } from "react";
import MyTooltip, { useMyTooltip } from "../myTooltip";

export default function PopperJSSample() {
  const [tooltipState, setTooltipState] = useState(null);
  const isTooltipVisible = tooltipState != null;

  const { referenceRef, tooltipData } = useMyTooltip();
  return (
    <article>
      <h2>Popper.js (React)</h2>
      <p>
        The simplest approach of using{" "}
        <a
          ref={tooltipState === 0 ? referenceRef : null}
          href="https://popper.js.org/react-popper/"
          target="_blank"
          rel="noreferrer"
        >
          PopperJs React Wrapper
        </a>
        .
        {isTooltipVisible && (
          <button
            ref={tooltipState === 1 ? referenceRef : null}
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
        <MyTooltip tooltipData={tooltipData}>
          <span> A cool library to handle overlay elements</span>:
          <pre>styles: {JSON.stringify(tooltipData.styles, null, 2)}</pre>
          <pre>
            attributes: {JSON.stringify(tooltipData.attributes, null, 2)}
          </pre>
        </MyTooltip>
      )}
    </article>
  );
}
