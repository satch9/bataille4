import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
<<<<<<< HEAD
import { SocketContext, socket } from './context/SocketContext'
=======
import { SocketContext, socket } from './context/SocketContext.js'
>>>>>>> e4e0cac (suite mise en place de socket dans le frontend et dans le backend)

import RootLayout from './layouts/root-layout'

import IndexPage from './routes'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import Parameters from './components/Parameters'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/params", element: <Parameters /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketContext.Provider value={socket} >
      <RouterProvider router={router} />
    </SocketContext.Provider>
<<<<<<< HEAD
=======

>>>>>>> e4e0cac (suite mise en place de socket dans le frontend et dans le backend)
  </React.StrictMode>,
)
