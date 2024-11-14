import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import "swiper/css/bundle";
import "styles/index.scss";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "redux/store";
import reportWebVitals from "./reportWebVitals";
import { Slide, ToastContainer } from "react-toastify";
import { LanguageProvider } from "./contexts/LanguageContext";  // Import LanguageProvider

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <LanguageProvider>
        <App />
        <ToastContainer transition={Slide} />
      </LanguageProvider>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
