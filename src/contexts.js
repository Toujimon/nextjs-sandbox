import { createContext } from "react";

export const RelevantContentContext = createContext({
  isRelevant: () => false,
  markAsIrrelevant: () => {}
});
