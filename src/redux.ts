import { useMemo } from "react";
import { Store } from "redux";

type CreateStore = (params: Record<string, any> | undefined) => Store;

type InitRedux = (initState: Record<string, any>) => Store;

type UseRedux = (dependencies: any[], initState: Record<string, any>) => Store;

interface NextReduxGenerator {
  initRedux: InitRedux;
  useRedux: UseRedux;
}

const nextRedux = (createStore: CreateStore): NextReduxGenerator => {
  let reduxStore: Store | undefined;

  const initRedux: InitRedux = (initState) => {
    let _reduxStore: Store = reduxStore ?? createStore(initState);

    if (initState && reduxStore) {
      _reduxStore = createStore({
        ...reduxStore.getState(),
        ...initState
      });
      reduxStore = undefined;
    }

    if (typeof window === "undefined") {
      return _reduxStore;
    }

    if (!reduxStore) {
      reduxStore = _reduxStore;
    }

    return _reduxStore;
  };

  const useRedux: UseRedux = (dependencies, initState) => {
    const reduxStore = useMemo(() => initRedux(initState), dependencies);

    return reduxStore;
  };

  return { initRedux, useRedux };
};

export default nextRedux;
