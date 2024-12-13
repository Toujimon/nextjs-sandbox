import React, { useState, useRef, useEffect } from "react";

const STATUS = {
    CONCEALED: "CONCEALED",
    CONCEALING: "CONCEALING",
    REVEALING: "REVEALING",
    REVEALED: "REVEALED"
};

const TRANSITIONING_STATUSES = [STATUS.CONCEALING, STATUS.REVEALING];

const DEFAULT_TRANSITION_MILLISECONDS = 300;

const MIN_VISIBLE_PIXELS_HEIGHT = 3;


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

class VisibilityStatusManager {
    concealMilliseconds = DEFAULT_TRANSITION_MILLISECONDS;
    revealMilliseconds = DEFAULT_TRANSITION_MILLISECONDS;
    onStatusUpdate = null;
    getElementVisibleHeight = null;

    _hidden;
    _status;
    _styles;
    _clearElementHandlers = null;

    constructor(hidden) {
        this._hidden = hidden;
        this._status = hidden ? STATUS.CONCEALED : STATUS.REVEALED;
        this._styles = getStyleByStatus(this._status);

        this._resizeObserver = new ResizeObserver((entries) => {
            const [entry] = entries;

            // It will only refresh the status when the "height" style has a value, so it means the explicit styling is already applied
            if (entry.target.style.height) {
                this.refreshStatus();
            }
        });

        this._handleTransitionEnd = () => {
            this.refreshStatus();
        }
    }

    reveal() {
        if (this._hidden) {
            this._hidden = false;
            this.refreshStatus();
        }
    }

    conceal() {
        if (!this._hidden) {
            this._hidden = true;
            this.refreshStatus();
        }
    }

    getCurrentStatus() {
        return this._status;
    }

    getCurrentStyles() {
        return this.currentStyles;
    }

    refreshStatus() {

        const status = this._status;
        const hidden = this._hidden;

        // Current event handlers and observers are cleared
        this._clearElementHandlers?.();

        // The next state is calculated. If it wouldn't change, the process stops.
        const visibleHeight = this.getElementVisibleHeight?.() ?? 0;

        const transitionMilliseconds = hidden ? this.concealMilliseconds : this.revealMilliseconds;

        const nextStatus = getNextStatus(status, hidden, visibleHeight, transitionMilliseconds);

        if (nextStatus === status) {
            return;
        }

        // Some decisions will be taken depending if the current and/or next states are "transitioning" ones 
        const currentIsTransitioningStatus = TRANSITIONING_STATUSES.includes(status);
        const nextIsTransitioningStatus = TRANSITIONING_STATUSES.includes(nextStatus);

        /* If it goes from a transitioning state to the next, there will be an animation delay. It is needed to be known
        so an event listener is added and the next state can be triggered when it finishes */
        const nextStatusHasAnimation = currentIsTransitioningStatus && nextIsTransitioningStatus;

        const nextStyles = getStyleByStatus(
            nextStatus,
            visibleHeight,
            nextStatusHasAnimation ? transitionMilliseconds : 0);

        this._status = nextStatus;
        this._styles = nextStyles;

        this.onStatusUpdate?.(nextStatus, nextStyles, (element) => {
            /* If it goes from a "final" state to a "transitioning" one, the observer is activated. As it will be needed
          to react to the first change in explicit height before initiating the transition animation */
            if (!currentIsTransitioningStatus && nextIsTransitioningStatus) {
                this._resizeObserver.observe(element);
            }

            if (nextStatusHasAnimation) {
                element.addEventListener('transitionend', this._handleTransitionEnd);
            }

            this._clearElementHandlers = () => {
                element.removeEventListener('transitionend', this._handleTransitionEnd);
                this._resizeObserver.disconnect();
                this._clearElementHandlers = null;
            }
        })
    }

    clearElementHandlers() {
        this._clearElementHandlers?.();
        this._clearElementHandlers = null;
    }
}

function getVisibleHeight(element) {
    if (!element || !element.firstElementChild) {
        return 0;
    }

    const childElement = element.firstElementChild;

    return (Math.floor(childElement.getBoundingClientRect().top - element.getBoundingClientRect().top) + (childElement.scrollHeight));
}

export const AnimatedConcealableContent = ({
    hidden = false,
    transitionMilliseconds,
    revealMilliseconds,
    concealMilliseconds,
    onRevealed,
    onConcealed,
    children }) => {
    const wrapperRef = useRef(null);

    const [visibilityStatusManager] = useState(() => new VisibilityStatusManager(hidden));

    const [style, setStyle] = useState(() => visibilityStatusManager.currentStyles);

    const shouldTriggerCallbackRef = useRef(false);

    useEffect(() => {
        visibilityStatusManager.getElementVisibleHeight = () => {
            const visibleHeight = getVisibleHeight(wrapperRef.current)
            return visibleHeight;
        };

        visibilityStatusManager.onStatusUpdate = (newStatus, newStyles, setElementHandlers) => {
            setStyle(newStyles);
            if (wrapperRef.current) {
                setElementHandlers(wrapperRef.current);
            }
            if (newStatus === STATUS.CONCEALED || newStatus === STATUS.REVEALED) {
                shouldTriggerCallbackRef.current = true;
            }
        };

        return () => {
            shouldTriggerCallbackRef.current = false;
            visibilityStatusManager.clearElementHandlers();
        }
    }, []);

    useEffect(() => {
        if (shouldTriggerCallbackRef.current) {
            shouldTriggerCallbackRef.current = false;
            switch (visibilityStatusManager.getCurrentStatus()) {
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

    useEffect(() => {
        // Every time milliseconds props change, it updates the instance data values so they are in sync
        visibilityStatusManager.concealMilliseconds = Math.max(0, concealMilliseconds ?? transitionMilliseconds ?? DEFAULT_TRANSITION_MILLISECONDS);
        visibilityStatusManager.revealMilliseconds = Math.max(0, revealMilliseconds ?? transitionMilliseconds ?? DEFAULT_TRANSITION_MILLISECONDS);
    }, [transitionMilliseconds, concealMilliseconds, revealMilliseconds]);

    useEffect(() => {
        // When the "hidden" property changes, the instance data gets in sync and a new visibility status may need to be calculated
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