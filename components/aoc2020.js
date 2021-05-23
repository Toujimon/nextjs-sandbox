/**
 * Here I'm going to have all
 * my Advent of Code solutions
 * components to be imported from
 * other pages
 */

import { useState } from "react";

function calculateDay01SolutionPart1(input) {
  try {
    const numbers = input.split("\n").map((str) => Number(str));
    for (let i = 0; i < numbers.length; i += 1) {
      const a = numbers[i];
      for (let j = i + 1; j < numbers.length; j += 1) {
        const b = numbers[j];
        if (a + b === 2020) {
          return `${a} + ${b} = ${a * b}`;
        }
      }
    }
    return "Result not found";
  } catch (error) {
    return error.toString();
  }
}

function calculateDay01SolutionPart2(input) {
  try {
    const numbers = input.split("\n").map((str) => Number(str));
    for (let i = 0; i < numbers.length; i += 1) {
      const a = numbers[i];
      for (let j = i + 1; j < numbers.length; j += 1) {
        const b = numbers[j];
        if (a + b > 2020) {
          continue;
        }
        for (let k = j + 1; k < numbers.length; k += 1) {
          const c = numbers[k];
          if (a + b + c === 2020) {
            return `${a} + ${b} + ${c} = ${a * b * c}`;
          }
        }
      }
    }
    return "Result not found";
  } catch (error) {
    return error.toString();
  }
}

export default [
  function Day01() {
    const [input, setInput] = useState("");
    const [solution1, setSolution1] = useState("");
    const [solution2, setSolution2] = useState("");
    return (
      <div>
        <fieldset>
          <legend>Inputs</legend>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} />
        </fieldset>
        <fieldset>
          <legend>Output</legend>
          <button
            type="button"
            onClick={() => setSolution1(calculateDay01SolutionPart1(input))}
          >
            Part 1 solution
          </button>
          <div>{solution1}</div>
        </fieldset>
        <fieldset>
          <legend>Output</legend>
          <button
            type="button"
            onClick={() => setSolution2(calculateDay01SolutionPart2(input))}
          >
            Part 2 solution
          </button>
          <div>{solution2}</div>
        </fieldset>
      </div>
    );
  },
  function Day02() {
    return <div>Day TWO!</div>;
  },
  function Day03() {
    return <div>This is Day Threee!</div>;
  },
];
