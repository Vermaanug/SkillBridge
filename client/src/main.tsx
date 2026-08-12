import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import queryClientGlobal from "./config/tanstack-query.config";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClientGlobal}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
