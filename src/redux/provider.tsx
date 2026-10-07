"use client";

import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";
import { initializeAuth } from "./features/authSlice";

/**
 * Client-side Redux provider.
 * Uses lazy `useState` initializer — creates the store exactly once per mount and hydrates auth state.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => {
    const s = makeStore();
    return s;
  });

  useEffect(() => {
    store.dispatch(initializeAuth());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
