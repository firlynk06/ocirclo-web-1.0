import React from "react";
import { createRoot } from "react-dom/client";
// Font di-bundle (bukan dari Google Fonts) supaya demo tetap rapi saat offline.
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./styles/tokens.css";
import "./styles/app.css";
import "./styles/auth.css";
import "./styles/consumer.css";
import "./styles/business.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
