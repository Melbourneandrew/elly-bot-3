import React from 'react'
import ReactDOM from 'react-dom/client'
import Chat from './views/Chat.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter(
  [
    { path: "/", Component: Chat },
  ],
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
