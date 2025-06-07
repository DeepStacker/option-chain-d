import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppWrapper } from "./context/AppProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./context/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </Provider>
  </StrictMode>
);
