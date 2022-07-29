import React, { useState } from "react";
import { useSingularTimeout } from "../../src/useSingularTimeout";

const AlertTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [set, clear] = useSingularTimeout();
  return (
    <div>
      <button
        type="button"
        disabled={isRunning}
        onClick={() => {
          setIsRunning(true);
          set(() => {
            alert("This is the alert!");
            setIsRunning(false);
          }, 5000);
        }}
      >
        {!isRunning
          ? "Alert will show in 5 seconds after clicking this"
          : `Alert will show in some seconds!`}
      </button>
      {isRunning && (
        <>
          <button
            type="button"
            onClick={() => {
              clear();
              setIsRunning(false);
            }}
          >
            Nope, stop it
          </button>
          <button type="button" onClick={() => clear(true)}>
            Show it now better
          </button>
        </>
      )}
    </div>
  );
};

const HoverTester = () => {
  const [activeZone, setActiveZone] = useState(null);
  const [set] = useSingularTimeout();
  return (
    <div>
      <p>
        The last hovered zone will become "active" after 0.2 seconds over it.
        All will become unactive when the mouse leaves all zones for 0.5 seconds
      </p>
      <div
        style={{
          display: "grid",
          gridTemplate: "64px / repeat(3, 1fr)",
          gap: "8px",
        }}
        onMouseLeave={() => {
          set(() => setActiveZone(null), 500);
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            style={{
              border: `1px solid ${activeZone === index ? "red" : "black"}`,
              borderRadius: "4px",
            }}
            onMouseOver={() => {
              set(() => {
                setActiveZone(index);
              }, 200);
            }}
          >
            {`Zone ${index}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TimeoutTester() {
  const [showAlertTester, setShowAlertTester] = useState(true);
  const [showHoverTester, setShowHoverTester] = useState(true);
  return (
    <article>
      <h2>Timeout tester</h2>
      <p>
        The next test cases make use of the "useSingularTimeout" hook. If any
        test is "unrendered" while there is a timeout pending, those will be
        cleared without the callback being invoked.
      </p>

      <div>
        <label>
          <input
            type="checkbox"
            checked={showAlertTester}
            onChange={() => setShowAlertTester((prev) => !prev)}
          />
          Render "alert" test component
        </label>
        {showAlertTester && <AlertTester />}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showHoverTester}
            onChange={() => setShowHoverTester((prev) => !prev)}
          />
          Render "hover" test component
        </label>
        {showHoverTester && <HoverTester />}
      </div>
    </article>
  );
}
