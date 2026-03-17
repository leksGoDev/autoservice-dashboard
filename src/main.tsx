import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "@/app/App";
import "@/app/styles/global.css";
import { enableMocking } from "@/mocks";

async function bootstrap() {
  await enableMocking();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

void bootstrap();
