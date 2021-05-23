import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "../../components/mainLayout";
import Link from "next/link";
import { styled, Typography } from "@material-ui/core";
import emStyled from "@emotion/styled";

const CalendarList = styled("ul")({
  display: "inline-grid",
  gridTemplateColumns: "repeat(7, 32px)",
  gridAutoRows: "32px",
  listStyle: "none",
  margin: 0,
  padding: 0,
  ...(() => {
    const daysRules = {};
    for (let i = 1; i <= 7; i += 1) {
      const weekDay = i % 7;
      daysRules[`& > li[data-weekday="${weekDay}"]`] = {
        gridColumnStart: i
      };
    }
    return daysRules;
  })()
});

const AoCIframe = emStyled.iframe`
  width: 100%;
  min-height: 600px;
`;

export default function AdventOfCode() {
  const [dayComponents, setDayComponents] = useState(null);
  const router = useRouter();
  const [year, day] = router.query.yearAndDay ?? [];
  const daysOfTheMonth = useMemo(() => {
    if (year) {
      const daysCollection = [];
      const dayIterator = new Date(year, 11, 1);
      while (dayIterator.getMonth() === 11) {
        daysCollection.push(new Date(dayIterator));
        dayIterator.setDate(dayIterator.getDate() + 1);
      }
      return daysCollection;
    }
  }, [year]);
  // TODO: Check if I can do this dynamically on the server too
  useEffect(() => {
    if (year != null) {
      async function loadDayComponents() {
        try {
          const daysModule = await import(
            "../../components/aoc" + year + ".js"
          );
          setDayComponents(daysModule.default);
        } catch (e) {
          console.error(e);
          setDayComponents([]);
        }
      }
      loadDayComponents();
    }
  }, [year]);
  useEffect(() => {
    // Fetch data for the day dinamically
  }, [year, day]);
  const DayComponent = dayComponents?.[day - 1] ?? null;
  return (
    <MainLayout>
      <div>
        <header>
          <h1>Advent of Code {year}</h1>
          <Link href="/advent-of-code">
            <a>Go back</a>
          </Link>
        </header>
        <Typography variant="caption" component="p">
          JFYI: All the components for the days are being dynamically imported
          based on the path information.
        </Typography>
        {dayComponents == null ? (
          `...loading days`
        ) : (
          <>
            <div>
              <p>There are solutions for {dayComponents.length} days:</p>
              <CalendarList>
                {daysOfTheMonth.map((dayDate, index) => {
                  const hasComponent = !!dayComponents[index];
                  const thisDay = index + 1;
                  return (
                    <li key={thisDay} data-weekday={dayDate.getDay()}>
                      {!hasComponent ? (
                        <span>{thisDay}</span>
                      ) : (
                        <Link
                          href={`/advent-of-code/${year}/${thisDay}`}
                          shallow
                        >
                          <a>{thisDay}</a>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </CalendarList>
            </div>
            {!DayComponent ? (
              <div>Select a day, please</div>
            ) : (
              <>
                <div>
                  <h2>{`Day ${day}`}</h2>
                  <AoCIframe
                    title="Challenge description"
                    src={`https://adventofcode.com/${year}/day/${day}`}
                  />
                </div>
                <div>
                  <DayComponent />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
