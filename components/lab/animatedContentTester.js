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

function getVisibleHeight(element) {
  if (!element || !element.firstElementChild) {
    return 0;
  }

  const childElement = element.firstElementChild;

  return (Math.floor(childElement.getBoundingClientRect().top - element.getBoundingClientRect().top) + (childElement.scrollHeight));
}

function getStyleByStatus(status, element, transitionMilliseconds = 0) {
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
    height: status === STATUS.CONCEALING ? 1 : Math.max(getVisibleHeight(element) - 1, 2)
  }
}

function getTransitioningStatusMilliseconds(status, concealMilliseconds, revealMilliseconds) {
  if (status === STATUS.REVEALING) {
    return revealMilliseconds;
  }
  if (status === STATUS.CONCEALING) {
    return concealMilliseconds;
  }
  return 0;
}

function getNextStatus(status, hidden) {
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
    updateVisibilityStatus: null,
    resizeObserver: null,
    handleTransitionEnd: null,
    concealMilliseconds: 0,
    revealMilliseconds: 0,
  })

  const [style, setStyle] = useState(() => getStyleByStatus(instanceDataRef.current.status));

  useEffect(() => {
    instanceDataRef.current.handleTransitionEnd = () => {
      const { calculateNewVisibilityStatus } = instanceDataRef.current;
      calculateNewVisibilityStatus?.();
    };

    instanceDataRef.current.resizeObserver = new ResizeObserver((entries) => {
      const { calculateNewVisibilityStatus } = instanceDataRef.current;
      const [entry] = entries;
      const currentHeight = entry.contentRect.height;
      // It will only trigger when the height is not 0 or the "visible" height, as the transitioning states always have a different heigth so it can be detected
      if (currentHeight !== 0 && currentHeight !== getVisibleHeight(entry.target)) {
        calculateNewVisibilityStatus?.();
      }
    });

    instanceDataRef.current.calculateNewVisibilityStatus = () => {
      const { status, hidden, handleTransitionEnd, resizeObserver, concealMilliseconds, revealMilliseconds } = instanceDataRef.current;

      // The next state is calculated. If it wouldn't change, the process stops.
      const nextStatus = getNextStatus(status, hidden);
      if (nextStatus === status) {
        return;
      }

      // Current event handlers and observers are cleared
      if (handleTransitionEnd) {
        wrapperRef.current?.removeEventListener('transitionend', handleTransitionEnd);
      }

      resizeObserver?.disconnect();

      // Some decisions will be taken depending if the current and next states are "transitioning"
      const currentIsTransitioningStatus = TRANSITIONING_STATUSES.includes(status);
      const nextIsTransitioningStatus = TRANSITIONING_STATUSES.includes(nextStatus);

      /* If it goes from an stationary state to a transitioning one, the observer is activated. As it will be needed
        to react to the first change in explicit height before initiating the transition animation */
      if (!currentIsTransitioningStatus && nextIsTransitioningStatus) {
        resizeObserver?.observe(wrapperRef.current);
      }

      /* If it goes from a transitioning state to the next, there will be an animation delay. It is needed to be known
      so an event listener is added and the next state can be triggered */
      const nextStatusHasAnimation = currentIsTransitioningStatus && nextIsTransitioningStatus;

      setStyle(getStyleByStatus(
        nextStatus,
        wrapperRef.current,
        nextStatusHasAnimation ?
          getTransitioningStatusMilliseconds(nextStatus, concealMilliseconds, revealMilliseconds) : null));

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
    instanceDataRef.current.calculateNewVisibilityStatus?.();
  }, [hiddenProp]);

  useEffect(() => {
    // Every time milliseconds props change, it updates the instance data so they are in sync
    instanceDataRef.current.concealMilliseconds = Math.max(1, concealMillisecondsProp ?? transitionMillisecondsProp ?? DEFAULT_TRANSITION_MILLISECONDS);
    instanceDataRef.current.revealMilliseconds = Math.max(1, revealMillisecondsProp ?? transitionMillisecondsProp ?? DEFAULT_TRANSITION_MILLISECONDS);
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
