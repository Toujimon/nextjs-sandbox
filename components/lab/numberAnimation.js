import React, { useState, useEffect, useRef } from "react";

const AnimatedNumberTester = () => {
  const [inputNumber, setInputNumber] = useState(100000);
  const [targetNumber, setTargetNumber] = useState(inputNumber);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTargetNumber(inputNumber);
        }}
      >
        <input
          type="number"
          name="inputNumber"
          value={inputNumber}
          onChange={(e) => {
            setInputNumber(Number(e.target.value));
          }}
        />
        <button type="submit">Set</button>
        <button
          type="button"
          onClick={() => {
            const newInputNumber = inputNumber - 50000;
            setInputNumber(newInputNumber);
            setTargetNumber(newInputNumber);
          }}
        >
          --50k
        </button>
        <button
          type="button"
          onClick={() => {
            const newInputNumber = inputNumber + 50000;
            setInputNumber(newInputNumber);
            setTargetNumber(newInputNumber);
          }}
        >
          50k++
        </button>
      </form>
      <br />
      <AnimatedNumber targetNumber={targetNumber} />
    </div>
  );
};

// The animation will work for 2 seconds
// 50 * 40 = 2000 milliseconds
const STEP_PERIOD = 50;
const STEPS = 40;

const useAnimatedNumber = (targetNumber) => {
  const [currentNumber, setCurrentNumber] = useState(targetNumber);

  const stepsInfo = useRef({
    pendingSteps: 0,
    stepAmount: 0,
    timeoutHandler: null,
  });

  useEffect(() => {
    if (currentNumber === targetNumber) {
      return;
    }

    const diff = targetNumber - currentNumber;
    const stepAmount = Math.trunc(diff / STEPS);

    if (Math.abs(stepAmount) < 1) {
      stepsInfo.current.stepAmount = 0;
      stepsInfo.current.pendingSteps = 0;

      setCurrentNumber(targetNumber);

      return;
    }

    stepsInfo.current.stepAmount = stepAmount;
    stepsInfo.current.pendingSteps = STEPS;

    setCurrentNumber((x) => x + stepsInfo.current.stepAmount);

    return () => {
      clearTimeout(stepsInfo.current.timeoutHandler);
    };
  }, [targetNumber]);

  useEffect(() => {
    stepsInfo.current.pendingSteps -= 1;
    const { pendingSteps, stepAmount } = stepsInfo.current;
    if (pendingSteps < 0) {
      return;
    }
    stepsInfo.current.timeoutHandler = setTimeout(() => {
      setCurrentNumber((x) => (pendingSteps ? x + stepAmount : targetNumber));
    }, STEP_PERIOD);
  }, [currentNumber]);

  return currentNumber;
};

const AnimatedNumber = ({ targetNumber }) => {
  const currentNumber = useAnimatedNumber(targetNumber);
  return <div>TEST {currentNumber}</div>;
};

export default function NumberAnimationTester() {
  return (
    <article>
      <h2>Number Change Animation</h2>
      <p>
        Just a simple take on how to make a number to change between different
        values with a fast counting animation
      </p>
      <AnimatedNumberTester />
    </article>
  );
}
