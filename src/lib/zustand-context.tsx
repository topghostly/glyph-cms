import { StoreApi } from "zustand";
import React from "react";

export const createZustandContext = <TInitial, TStore extends StoreApi<object>>(
  getStore: (initial: TInitial) => TStore
) => {
  const Context = React.createContext<TStore | null>(null);

  const Provider = (props: {
    children: React.ReactNode;
    initialValue: TInitial;
  }) => {
    const [store] = React.useState(() => getStore(props.initialValue));

    return <Context.Provider value={store}>{props.children}</Context.Provider>;
  };

  return {
    useContext: () => React.useContext(Context),
    Context,
    Provider,
  };
};
