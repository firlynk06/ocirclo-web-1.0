import { createContext, useContext } from "react";
// route aktif + fungsi pindah layar (hash routing). role: "seller" | "consumer" | null.
export const NavContext = createContext({
  route: "splash", go: () => {}, mode: "recommendation", setMode: () => {},
  role: null, switchAccount: () => {}, logout: () => {},
});
export const useNav = () => useContext(NavContext);
