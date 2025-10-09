import React, { useState, useRef, useEffect, useMemo } from "react";

const STATUS = {
    CONCEALED: "CONCEALED",
    ALMOST_CONCEALED: "ALMOST_CONCEALED",
    ALMOST_REVEALED: "ALMOST_REVEALED",
    REVEALED: "REVEALED"
};

const ALMOST_STATUSES = [STATUS.ALMOST_CONCEALED, STATUS.ALMOST_REVEALED];

const DEFAULT_TRANSITION_MILLISECONDS = 300;

const MIN_REVEALED_PIXELS_HEIGHT = 3;


function getStyleByStatus(status, revealedCompleteHeight = 0, transitionMilliseconds = 0) {
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
        height: status === STATUS.ALMOST_CONCEALED ? 1 : revealedCompleteHeight >= MIN_REVEALED_PIXELS_HEIGHT ? revealedCompleteHeight - 1 : MIN_REVEALED_PIXELS_HEIGHT
    }
}


function getNextStatus(status, shouldBeConcealed, revealedCompleteHeight, transitionMilliseconds) {

    // There are two edge cases where the state will go directly to a stationary one
    // 1) Literally no transition time
    // 2) The element was not concealed and the revealed complete height is so short that no transition is actually needed
    if (transitionMilliseconds <= 0 || (status !== STATUS.CONCEALED && revealedCompleteHeight < MIN_REVEALED_PIXELS_HEIGHT)) {
        return shouldBeConcealed ? STATUS.CONCEALED : STATUS.REVEALED;
    }

    /* 
    In any other case, the next status would be the next one depending if the element is supposed to be concealed or not:
    |----------------------------------------------------------------------|
    |  CONCEALED <--> ALMOST_CONCEALED <--> ALMOST_REVEALED <--> REVEALED  |
    |----------------------------------------------------------------------|
    */
    switch (status) {
        case STATUS.CONCEALED:
            return shouldBeConcealed ? status : STATUS.ALMOST_CONCEALED;
        case STATUS.ALMOST_CONCEALED:
            return shouldBeConcealed ? STATUS.CONCEALED : STATUS.ALMOST_REVEALED;
        case STATUS.ALMOST_REVEALED:
            return shouldBeConcealed ? STATUS.ALMOST_CONCEALED : STATUS.REVEALED;
        case STATUS.REVEALED:
            return shouldBeConcealed ? STATUS.ALMOST_REVEALED : status;
    }
}

class VisibilityStatusManager {
    concealMilliseconds = DEFAULT_TRANSITION_MILLISECONDS;
    revealMilliseconds = DEFAULT_TRANSITION_MILLISECONDS;
    onStatusUpdate = null;
    getElementRevealedCompleteHeight = null;

    _shouldBeConcealed;
    _status;
    _styles;
    _clearElementHandlers = null;

    constructor(shouldBeConcealed) {
        this._shouldBeConcealed = shouldBeConcealed;
        this._status = shouldBeConcealed ? STATUS.CONCEALED : STATUS.REVEALED;
        this._styles = getStyleByStatus(this._status);

        /* A resize observer is prepared. When active, it will trigger a status refreshing when the target element has a literal "style.height" value set
        (inline styling) meaning that height transitions will actually work if set as inline styles. */
        this._resizeObserver = new ResizeObserver((entries) => {
            const [entry] = entries;

            if (entry.target.style.height) {
                this.refreshStatus();
            }
        });

        /* A handler for transition ends is prepared. When set on a DOM element, 
        it will trigger when an animated transition finishes, triggering a status refresh */
        this._handleTransitionEnd = () => {
            this.refreshStatus();
        }
    }

    /* Activates the revealing flow. Only initiates if currently it was supposed to be concealed. */
    reveal() {
        if (this._shouldBeConcealed) {
            this._shouldBeConcealed = false;
            this.refreshStatus();
        }
    }

    /* Activates the concealing flow. Only initiates if currently it was supposed to be revealed. */
    conceal() {
        if (!this._shouldBeConcealed) {
            this._shouldBeConcealed = true;
            this.refreshStatus();
        }
    }

    getCurrentStatus() {
        return this._status;
    }

    getCurrentStyles() {
        return this._styles;
    }

    refreshStatus() {

        const currentStatus = this._status;
        const shouldBeConcealed = this._shouldBeConcealed;

        /* Current event handlers and observers are cleared. Either this function has been invoked imperatively and it should no longer wait for
        events to trigger, or it has been invoked by an even handler and they should be removed. */
        this._clearElementHandlers?.();

        // The element revealed complete height is obtained every time, as it is free to be modifies externally. 
        const revealedHeight = this.getElementRevealedCompleteHeight?.() ?? 0;

        // The transitioning milliseconds is obtained depending if it should be concealed or revealed.
        const transitionMilliseconds = shouldBeConcealed ? this.concealMilliseconds : this.revealMilliseconds;

        // The next state is calculated. If it wouldn't change, the process stops.
        const nextStatus = getNextStatus(currentStatus, shouldBeConcealed, revealedHeight, transitionMilliseconds);
        if (nextStatus === currentStatus) {
            return;
        }

        // Some decisions will be taken depending if the current and/or next states are "almost" ones 
        const currentIsAlmostStatus = ALMOST_STATUSES.includes(currentStatus);
        const nextIsAlmostStatus = ALMOST_STATUSES.includes(nextStatus);

        /* If it goes from an "almost" state to another "almost" state, the styles will need to add an animation. */
        const stylesHaveTransition = currentIsAlmostStatus && nextIsAlmostStatus;
        /* If it goes from a final state to an "almost" one, that means the styles will be introducing an "height" value. */
        const stylesIntroduceExplicitHeight = !currentIsAlmostStatus && nextIsAlmostStatus;

        const nextStyles = getStyleByStatus(
            nextStatus,
            revealedHeight,
            stylesHaveTransition ? transitionMilliseconds : 0);

        this._status = nextStatus;
        this._styles = nextStyles;

        this.onStatusUpdate?.(this._status, this._styles,
            /* The following function will be called by the user to set the handlers to the appropriate element.
            
            The "this._clearElementHandlers" function will be set to clear the appropriate handlers. It will be invoked on the
            next "refreshStatus" execution, which will happen either when the handlers trigger or there is an imperative call to it. */
            (element) => {
                /* It there is a transition set in the styles, the transition end handler is set so the next state change
                happens after it triggers. */
                if (stylesHaveTransition) {
                    element.addEventListener('transitionend', this._handleTransitionEnd);

                    this._clearElementHandlers = () => {
                        element.removeEventListener('transitionend', this._handleTransitionEnd);
                        this._clearElementHandlers = null;
                    }
                }
                /* In other case, if the styles will be introducing an explicit "height" value, the resize observer is activated so the
                next state change happens when the specific styling change with the height is detected in the DOM. */
                else if (stylesIntroduceExplicitHeight) {
                    this._resizeObserver.observe(element);

                    this._clearElementHandlers = () => {
                        this._resizeObserver.disconnect();
                        this._clearElementHandlers = null;
                    }
                }
            })
    }

    clearElementHandlers() {
        this._clearElementHandlers?.();
        this._clearElementHandlers = null;
    }
}


/**
 * Wrapping component to make its content "concealable" (or "revealable", it is relative) with a nice transition.
 */
export const AnimatedConcealableContent = ({
    hidden = false,
    transitionMilliseconds,
    revealMilliseconds,
    concealMilliseconds,
    onRevealed,
    onConcealed,
    children }) => {
    const wrapperRef = useRef(null);

    const visibilityStatusManager = useMemo(() => new VisibilityStatusManager(hidden), []);

    // The actual styles to apply to the container elements, will only update when the "onStatusUpdate" handler gets invoked
    const [style, setStyle] = useState(() => visibilityStatusManager.getCurrentStyles());

    // Instance value to know which callback should be triggered after the VISIBLE or HIDDEN status styles are applied
    const shouldTriggerCallbackRef = useRef(null);

    useEffect(() => {
        // This initial useEffect serves to setup the visibility status manager instance
        const element = wrapperRef.current;

        // Sets a way for the manager to know the height the element should have when revealed
        visibilityStatusManager.getElementRevealedCompleteHeight = () => {
            if (!element || !element.firstElementChild) {
                return 0;
            }

            const childElement = element.firstElementChild;

            // The difference between the top of parent and children plus the height of the children
            // (the "top" value gets higher the farthest the element is from the top of the document)
            /*
              ----------------Parent top------------------------
              |                                      ^         |
              |                                      |         |
              |                           child - parent top   |
              |                                      |         |
              |                                      v         |
              ----------------Child top------------------------|
              |                                      ^         |
              |                                      |         |
              |                                      |         |
              |                                      |         |
              |                           child scroll height  |
              |                                      |         |
              |                                      |         |
              |                                      |         |
              |                                      v         |
              --------------------------------------------------
            */
            return (Math.floor(childElement.getBoundingClientRect().top - element.getBoundingClientRect().top) + (childElement.scrollHeight));
        };

        // When the status updates on the instance, it will update the styles, set the proper event handlers for element on the new status
        // and prepare to trigger the callbacks if the new status is a finishing one (the element is completely visible or hidden). 
        visibilityStatusManager.onStatusUpdate = (newStatus, newStyles, setElementHandlers) => {
            setStyle(newStyles);
            if (wrapperRef.current) {
                setElementHandlers(wrapperRef.current);
            }
            if (newStatus === STATUS.CONCEALED || newStatus === STATUS.REVEALED) {
                shouldTriggerCallbackRef.current = newStatus;
            }
        };

        return () => {
            // If the component unmounts, no callback should be triggered and any event handlers on the DOM element should be cleared
            shouldTriggerCallbackRef.current = null;
            visibilityStatusManager.clearElementHandlers();
        }
    }, []);

    // When the styles change, it is the moment to trigger callbacks if the proper instance value was also set after the
    // status update
    useEffect(() => {
        if (shouldTriggerCallbackRef.current) {
            const finalStatus = shouldTriggerCallbackRef.current;
            shouldTriggerCallbackRef.current = null;

            switch (finalStatus) {
                case STATUS.CONCEALED:
                    onConcealed?.();
                    break;
                case STATUS.REVEALED:
                    onRevealed?.();
                    break;
                default:
            }
        }
    }, [style]);

    // We allow the user to set the transitioning times in different ways (in higuest to lowest priority):
    // -  Granularly: concealMilliseconds & revealMilliseconds
    // -  Generally: transitionMilliseconds
    // -  By default: no props set, 300 ms.
    // We compute both concealing and revealing values based on the prop values
    const [computedConcealMilliseconds, computedRevealMillisenconds] = useMemo(() => {
        return [
            Math.max(0, concealMilliseconds ?? transitionMilliseconds ?? DEFAULT_TRANSITION_MILLISECONDS),
            Math.max(0, revealMilliseconds ?? transitionMilliseconds ?? DEFAULT_TRANSITION_MILLISECONDS)
        ];
    }, [transitionMilliseconds, concealMilliseconds, revealMilliseconds]);

    // We keep the the instance data values in sync for the transitioning values
    visibilityStatusManager.concealMilliseconds = computedConcealMilliseconds;
    visibilityStatusManager.revealMilliseconds = computedRevealMillisenconds;


    // When the "hidden" property changes, the instance data gets in sync and a new visibility status may need to be calculated
    // It should not trigger any changes on the first render the "hidden" value will match the initial status of the instance (CONCEALED or REVEALED)
    useEffect(() => {
        if (hidden) {
            visibilityStatusManager.conceal();
        }
        else {
            visibilityStatusManager.reveal();
        }
    }, [hidden]);

    return <div ref={wrapperRef} style={style}>
        <div>{children}</div>
    </div>;
}