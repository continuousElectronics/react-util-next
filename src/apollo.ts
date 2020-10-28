import { ApolloClient } from "@apollo/client";
import { useMemo } from "react";

type InitApollo = (
  initState?: Record<string, any>,
  params?: Record<string, any>
) => ApolloClient<any>;

type UseApollo = (
  dependencies: any[],
  initState?: Record<string, any>,
  params?: Record<string, any>
) => ApolloClient<any>;

interface NextApolloGenerator {
  initApollo: InitApollo;
  useApollo: UseApollo;
}

type CreateApolloClient = (
  params: Record<string, any> | undefined
) => ApolloClient<any>;

const nextApollo = (
  createApolloClient: CreateApolloClient
): NextApolloGenerator => {
  let apolloClient: ApolloClient<any>;

  const initApollo: InitApollo = (initState, params) => {
    const _apolloClient = apolloClient ?? createApolloClient(params);

    if (initState) {
      _apolloClient.cache.restore(initState);
    }

    if (typeof window === "undefined") {
      return _apolloClient;
    }

    if (!apolloClient) {
      apolloClient = _apolloClient;
    }

    return _apolloClient;
  };

  const useApollo: UseApollo = (dependencies, initState, params) => {
    const apolloClient = useMemo(
      () => initApollo(initState, params),
      dependencies
    );

    return apolloClient;
  };

  return { initApollo, useApollo };
};

export default nextApollo;
