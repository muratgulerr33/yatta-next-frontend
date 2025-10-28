import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Health from './pages/Health.jsx'

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/health", element: <Health /> },
  { path: "*", element: <App /> } // SPA fallback
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
