import { QueryCache, QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: true
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending"
      }
    },
    queryCache: new QueryCache({
      onError: (error) => {
        const err = error as AxiosError<{ error?: unknown; message?: unknown }>;
        const raw = err.response?.data?.error ?? err.response?.data?.message;
        const message = typeof raw === "string" ? raw : "Something went wrong";
        console.error(message);
      }
    })
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
