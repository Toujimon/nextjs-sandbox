import { createContext } from "react";

export const ThemeTypeContext = createContext({
  type: "light",
  setType: () => {}
});

export const RelevantContentContext = createContext({
  isRelevant: () => false,
  markAsIrrelevant: () => {}
});
