import React, { useState } from "react";
import { AnimatedConcealableContent } from "../../src/AnimatedConcealableContent";

export default function AnimatedContentTested() {
  const [hidden, setHidden] = useState(false);
  const [transitionMilliseconds, setTransitionMilliseconds] = useState(300);
  return (
    <article>
      <h2>Animated content tester</h2>
      <p>
        Test cases for a custom solution to animate content that becomes visible/hidden.
      </p>
      <div>
        <button type="button" onClick={() => { setHidden(!hidden) }}>{`${hidden ? "Show" : "Hide"} the following content`}</button>
      </div>
      <div>
        <label>Transition milliseconds
          <input type="number"
            value={transitionMilliseconds}
            onChange={(event) => { setTransitionMilliseconds(Number.parseInt(event.target.value)) }}
          />
        </label>
      </div>
      <AnimatedConcealableContent hidden={hidden} transitionMilliseconds={transitionMilliseconds}
        onRevealed={() => {
          console.log(`debug::animated-content-tester: on revealed`);
        }}
        onConcealed={() => {
          console.log(`debug::animated-content-tester: on concealed`);
        }}
      >
        <div style={{ height: 100, backgroundColor: "#f00a", display: "flex", alignItems: "center", justifyContent: "center" }}>Something</div>
      </AnimatedConcealableContent>
    </article>
  );
}
