import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import "./index.css";
import "./styles/fonts.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/messages" element={<App />} />
        <Route path="/notifications" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route index element={<Navigate to="/messages" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
