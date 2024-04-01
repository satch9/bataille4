import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SocketContext, socket } from './context/SocketContext'
import { Provider } from 'react-redux'
import store from './redux/store'

import RootLayout from './layouts/root-layout'

import IndexPage from './routes'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import Parameters from './components/Parameters'
import GameBoard from './components/GameBoard'

/* const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      { path: "/params", element: <Parameters /> },
      { path: "/gameboard", element: <GameBoard /> },
    ]
  }
]) */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <SocketContext.Provider value={socket} >
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<IndexPage />} />
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="sign-up" element={<SignUpPage />} />
              <Route path="params" element={<Parameters />} />
              <Route path="gameboard">
                <Route path=":roomId" element={<GameBoard />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </SocketContext.Provider>

  </React.StrictMode>,
)
