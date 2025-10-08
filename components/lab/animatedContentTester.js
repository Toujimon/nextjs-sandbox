import React, { useState, useMemo } from "react";
import { AnimatedConcealableContent } from "../../src/AnimatedConcealableContent";
import { AnimatedContainer } from "../../src/AnimatedContainer";

export default function AnimatedContentTested() {
  const [hidden, setHidden] = useState(false);
  const [transitionMilliseconds, setTransitionMilliseconds] = useState(300);
  const [animatedItemsAmount, setAnimatedItemsAmount] = useState(5);
  const animatedItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < animatedItemsAmount; i += 1) {
      const rgbIndex = i % 3;
      const offset = 4 + (i % 5);
      const colorOffset = (offset * 16) % 256;
      items.push(`rgb(${rgbIndex === 0 ? 255 - colorOffset : colorOffset},${rgbIndex === 1 ? 255 - colorOffset : colorOffset},${rgbIndex === 2 ? 255 - colorOffset : colorOffset})`)
    }
    return items;
  }, [animatedItemsAmount])
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
      <h3>Animated container</h3>
      <p>Using the animated content items inside a wrapper that will make elements appear and dissapear as they enter or leave the collection</p>
      <div>
        <label>Amount of items
          <input type="number"
            value={animatedItemsAmount}
            onChange={(event) => { setAnimatedItemsAmount(Number.parseInt(event.target.value)) }}
          />
        </label>
      </div>
      <AnimatedContainer items={animatedItems} getKeyFromItem={item => item}
        renderItem={(item) => <div style={{
          height: 100,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: item,
          marginTop: 8
        }}><span style={{ backgroundColor: "white" }}>{item}</span></div>} />
    </article>
  );
}
