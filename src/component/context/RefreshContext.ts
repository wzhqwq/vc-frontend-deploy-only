import { createContext, useContext } from "react";

export const RefreshContext = createContext(false)

export function useRefreshEnabled() {
  return useContext(RefreshContext)
}