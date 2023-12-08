import { createContext, useContext } from "react";

export const RootContext = createContext({
  scrollDirection: true,
});

export const useRootContext = () => useContext(RootContext);
