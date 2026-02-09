import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "./shared/utils/error-message.utils.ts";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      console.error(error);
      if (typeof window !== "undefined" && window.location.pathname.includes("dash")) {
        toast.error(getErrorMessage(error));
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      console.error(error);
      if (typeof window !== "undefined" && window.location.pathname.includes("dash")) {
        toast.error(getErrorMessage(error));
      }
    },
  }),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
