import { createContext, useContext } from "react";
export const ConsumerContext = createContext(null);
export const useConsumer = () => useContext(ConsumerContext);
