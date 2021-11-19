import { useContext, useState, useMemo, useRef, useEffect } from "react";
import MainLayout from "../components/mainLayout";
import MyTooltip, { useMyTooltip } from "../components/myTooltip";
import IntersectionDetectorSample from "../components/lab/intersectionDetectorSample";
import { RelevantContentContext } from "../src/contexts";

function PopperJSSample() {
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

const items = Array.from({ length: 5 }).map((_, index) => `Item #${index}`);

function RelevantItemsPlayground() {
  const { isRelevant, markAsIrrelevant } = useContext(RelevantContentContext);
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item}
          style={{ visibility: isRelevant(item) ? "visible" : "hidden" }}
        >
          {item}&nbsp;
          <button type="button" onClick={() => markAsIrrelevant(item)}>
            not relevant anymore
          </button>
        </li>
      ))}
    </ul>
  );
}

function RelevantContentSample() {
  const [notRelevantElements, setNotRelevantElements] = useState([]);
  const relevantUntilNot = useMemo(() => {
    return {
      isRelevant: (key) => !notRelevantElements.includes(key),
      markAsIrrelevant: (key) => {
        setNotRelevantElements((prev) => prev.concat(key));
      },
    };
  }, [notRelevantElements]);

  const [orderedElements, setOrderedElements] = useState([]);
  const orderedElementsChecker = useRef({
    seen: new Set(orderedElements),
    list: orderedElements,
  });
  const onlyOneRelevant = useMemo(() => {
    return {
      isRelevant(key) {
        if (orderedElements[0] === key) {
          return true;
        }
        const { list, seen } = orderedElementsChecker.current;
        if (!seen.has(key)) {
          seen.add(key);
          orderedElementsChecker.current.list = [...list, key];
        }
        return false;
      },
      markAsIrrelevant(key) {
        const { list } = orderedElementsChecker.current;
        if (list[0] === key) {
          const newList = list.slice(1);
          orderedElementsChecker.current.list = newList;
          setOrderedElements(newList);
        }
      },
    };
  }, [orderedElements]);
  useEffect(() => {
    const { list } = orderedElementsChecker.current;
    if (orderedElements !== list) {
      setOrderedElements(list);
    }
  }, [orderedElements]);

  return (
    <article>
      <h2>Relevant Content Context</h2>
      <p>
        Making use of a simple system to make content visible only when it is
        relevant.
      </p>
      <p>
        For example, all the next items are relevant until they
        &quot;don&apos;t&quot;. <br />
        <button type="button" onClick={() => setNotRelevantElements([])}>
          Reset Sample
        </button>
      </p>
      <RelevantContentContext.Provider value={relevantUntilNot}>
        <RelevantItemsPlayground />
      </RelevantContentContext.Provider>
      <p>
        In the next case, only one item at a time is relevant. <br />
        <button
          type="button"
          onClick={() => {
            orderedElementsChecker.current.seen.clear();
            orderedElementsChecker.current.list = [];
            setOrderedElements(orderedElementsChecker.current.list);
          }}
        >
          Reset Sample
        </button>
      </p>
      <RelevantContentContext.Provider value={onlyOneRelevant}>
        <RelevantItemsPlayground />
      </RelevantContentContext.Provider>
    </article>
  );
}

const AnimationState = {
  NULL: 0,
  READY: 1,
  ENTERING: 2,
  RESTING: 3,
  LEAVING: 4,
  GONE: 5,
};

function AnimationHandlerSample() {
  const [isVisible, setIsVisible] = useState(false);

  const [state, setState] = useState(AnimationState.NULL);

  const timeoutManager = useRef(null);

  const exists = state !== AnimationState.NULL;
  const visible =
    exists && state > AnimationState.RESTING && state <= AnimationState.RESTING;

  useEffect(() => {
    if (isVisible) {
      if (state === AnimationState.NULL) {
        setState(AnimationState.READY);
      } else if (state > AnimationState.RESTING) {
        setState(AnimationState.ENTERING);
      }
    } else if (!isVisible && state > AnimationState.NULL) {
      if (state === AnimationState.READY) {
        setState(AnimationState.NULL);
      } else if (
        state === AnimationState.ENTERING ||
        state === AnimationState.RESTING
      ) {
        setState(AnimationState.LEAVING);
      }
    }
  }, [isVisible, state]);

  useEffect(() => {
    return () => {
      if (timeoutManager.current) {
      }
    };
  }, [state]);

  return (
    <article>
      <h2>Animation Handler</h2>
      <p>
        Trying to have my own system to handle animations when elements enter
        into view without external libraries.
      </p>
      <div>
        <button type="button" onClick={() => setIsVisible((prev) => !prev)}>
          Click here to display
        </button>
        <div style={{ height: 300, backgroundColor: "#faa" }}>
          <div
            style={{
              overflow: "hidden",
              ...(!isVisible && { display: "none" }),
            }}
          >
            <div
              style={{
                border: "1px solid black",
                padding: 8,
                borderRadius: 4,
                transition: `all 1000ms linear`,
                transform: `translateY(${isVisible ? 0 : 100}%)`,
                backgroundColor: "#fff",
              }}
            >
              This thing gets visible with a cool animation
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Lab(props) {
  return (
    <MainLayout>
      <p>Simple space for playing around with different features.</p>
      <IntersectionDetectorSample />
      <PopperJSSample />
      <RelevantContentSample />
      <AnimationHandlerSample />
    </MainLayout>
  );
}
