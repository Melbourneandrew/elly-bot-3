import React from "react";
import ReactDOM from "react-dom/client";
import Chat from "./views/Chat.jsx";
import Admin from "./views/Admin.jsx";
import Login from "./views/Login.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", Component: Chat },
  { path: "/admin", Component: Admin },
  { path: "/login", Component: Login },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
