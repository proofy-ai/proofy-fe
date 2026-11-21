import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import App from "./App";

const queryClient = new QueryClient();

if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true") {
  const { network } = await import("virtual:msw");
  const { handlers } = await import("@/mocks/handlers");
  network.configure({ handlers });
  await network.enable();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
