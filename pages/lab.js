import { useState, useEffect } from "react";
import MainLayout from "../components/mainLayout";

const labSamples = [
  "popperJs",
  "relevantContent",
  "intersectionDetector",
  "timeoutTester",
];

export default function Lab(props) {
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const sampleModules = await Promise.all(
          labSamples.map((name) => import(`../components/lab/${name}.js`))
        );
        setSamples(sampleModules.map((module) => module.default));
      } catch (e) {
        console.error(e);
        setSamples([]);
      }
    })();
  }, []);

  return (
    <MainLayout>
      <p>
        Simple space for playing around with different features. All the samples
        here have been loaded dynamically.
      </p>
      {samples.map((Sample, index) => (
        <Sample />
      ))}
    </MainLayout>
  );
}
