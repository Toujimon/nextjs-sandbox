import React, { useState, useRef, useEffect } from "react";
import { useSingularTimeout } from "../../src/useSingularTimeout";

const STATUS = {
  CONCEALED: "CONCEALED",
  CONCEALING: "CONCEALING",
  REVEALING: "REVEALING",
  REVEALED: "REVEALED"
};

const TRANSITIONING_STATUSES = [STATUS.CONCEALING, STATUS.REVEALING];

const DEFAULT_TRANSITION_MILLISECONDS = 300;

const MIN_VISIBLE_PIXELS_HEIGHT = 3;

function getVisibleHeight(element) {
  if (!element || !element.firstElementChild) {
    return 0;
  }

  const childElement = element.firstElementChild;

  return (Math.floor(childElement.getBoundingClientRect().top - element.getBoundingClientRect().top) + (childElement.scrollHeight));
}

function getStyleByStatus(status, visibleHeight = 0, transitionMilliseconds = 0) {
  if (status === STATUS.REVEALED) {
    return {};
  }
  if (status === STATUS.CONCEALED) {
    return {
      display: "none"
    };
  }
  return {
    overflow: "hidden",
    ...(transitionMilliseconds ? {
      transition: `all ${transitionMilliseconds}ms ease-in-out`,
    } : {}),
    height: status === STATUS.CONCEALING ? 1 : visibleHeight >= MIN_VISIBLE_PIXELS_HEIGHT ? visibleHeight - 1 : MIN_VISIBLE_PIXELS_HEIGHT
  }
}


function getNextStatus(status, hidden, visibleHeight, transitionMilliseconds) {

  // There are two edge cases where the state will go directly to stationary
  if (transitionMilliseconds <= 0 || (status !== STATUS.CONCEALED && visibleHeight < MIN_VISIBLE_PIXELS_HEIGHT)) {
    return hidden ? STATUS.CONCEALED : STATUS.REVEALED;
  }

  switch (status) {
    case STATUS.CONCEALED:
      return hidden ? status : STATUS.CONCEALING;
    case STATUS.CONCEALING:
      return hidden ? STATUS.CONCEALED : STATUS.REVEALING;
    case STATUS.REVEALING:
      return hidden ? STATUS.CONCEALING : STATUS.REVEALED;
    case STATUS.REVEALED:
      return hidden ? STATUS.REVEALING : status;
  }
}

const AnimatedConcealableContent = ({
  hidden: hiddenProp = false,
  transitionMilliseconds: transitionMillisecondsProp,
  revealMilliseconds: revealMillisecondsProp,
  concealMilliseconds: concealMillisecondsProp,
  children }) => {
  const wrapperRef = useRef(null);

  const instanceDataRef = useRef({
    status: hiddenProp ? STATUS.CONCEALED : STATUS.REVEALED,
    hidden: hiddenProp,
    concealMilliseconds: 0,
    revealMilliseconds: 0,
    resizeObserver: null,
    handleTransitionEnd: null,
    refreshStatus: null,
  })

  const [style, setStyle] = useState(() => getStyleByStatus(instanceDataRef.current.status));

  useEffect(() => {
    instanceDataRef.current.handleTransitionEnd = () => {
      const { refreshStatus } = instanceDataRef.current;
      refreshStatus?.();
    };

    instanceDataRef.current.resizeObserver = new ResizeObserver((entries) => {
      const { refreshStatus } = instanceDataRef.current;
      const [entry] = entries;

      // It will only refresh the status when the "height" style has a value, so it means the explicit styling is already applied
      if (entry.target.style.height) {
        refreshStatus?.();
      }
    });

    instanceDataRef.current.refreshStatus = () => {
      const { status, hidden, handleTransitionEnd, resizeObserver, concealMilliseconds, revealMilliseconds } = instanceDataRef.current;

      // Current event handlers and observers are cleared
      if (handleTransitionEnd) {
        wrapperRef.current?.removeEventListener('transitionend', handleTransitionEnd);
      }

      resizeObserver?.disconnect();


      // The next state is calculated. If it wouldn't change, the process stops.
      const visibleHeight = getVisibleHeight(wrapperRef.current);

      const transitionMilliseconds = hidden ? concealMilliseconds : revealMilliseconds;

      const nextStatus = getNextStatus(status, hidden, visibleHeight, transitionMilliseconds);

      console.log(`debug::refresh-status:init`, { status, nextStatus, visibleHeight, transitionMilliseconds });

      if (nextStatus === status) {
        return;
      }

      // Some decisions will be taken depending if the current and/or next states are "transitioning" ones 
      const currentIsTransitioningStatus = TRANSITIONING_STATUSES.includes(status);
      const nextIsTransitioningStatus = TRANSITIONING_STATUSES.includes(nextStatus);

      /* If it goes from a "final" state to a "transitioning" one, the observer is activated. As it will be needed
        to react to the first change in explicit height before initiating the transition animation */
      if (!currentIsTransitioningStatus && nextIsTransitioningStatus) {
        resizeObserver?.observe(wrapperRef.current);
      }

      /* If it goes from a transitioning state to the next, there will be an animation delay. It is needed to be known
      so an event listener is added and the next state can be triggered when it finishes */
      const nextStatusHasAnimation = currentIsTransitioningStatus && nextIsTransitioningStatus;

      setStyle(getStyleByStatus(
        nextStatus,
        visibleHeight,
        nextStatusHasAnimation ? transitionMilliseconds : 0));

      if (nextStatusHasAnimation) {
        wrapperRef.current?.addEventListener('transitionend', handleTransitionEnd);
      }

      instanceDataRef.current.status = nextStatus;
    }

    return () => {
      wrapperRef.current?.removeEventListener('transitionend', instanceDataRef.current.handleTransitionEnd);
      instanceDataRef.current.resizeObserver?.disconnect();
    }
  }, []);

  useEffect(() => {
    // When the "hidden" property changes, the instance data gets in sync and a new visibility status may need to be calculated
    instanceDataRef.current.hidden = hiddenProp;
    instanceDataRef.current.refreshStatus?.();
  }, [hiddenProp]);

  useEffect(() => {
    // Every time milliseconds props change, it updates the instance data values so they are in sync
    instanceDataRef.current.concealMilliseconds = Math.max(0, concealMillisecondsProp ?? transitionMillisecondsProp ?? DEFAULT_TRANSITION_MILLISECONDS);
    instanceDataRef.current.revealMilliseconds = Math.max(0, revealMillisecondsProp ?? transitionMillisecondsProp ?? DEFAULT_TRANSITION_MILLISECONDS);
  }, [transitionMillisecondsProp, concealMillisecondsProp, revealMillisecondsProp]);

  return <div ref={wrapperRef} style={style}>
    <div>{children}</div>
  </div>;
}


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
      <AnimatedConcealableContent hidden={hidden} transitionMilliseconds={transitionMilliseconds}>
        <div style={{ height: 100, backgroundColor: "#f00a", display: "flex", alignItems: "center", justifyContent: "center" }}>Something</div>
      </AnimatedConcealableContent>
    </article>
  );
}
