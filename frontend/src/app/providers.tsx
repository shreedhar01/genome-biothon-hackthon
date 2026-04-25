import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { queryClient } from "../lib/query-client";
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}
