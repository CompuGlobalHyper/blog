import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";
import ErrorPage from 'src/shared/components/ErrorPage.jsx';
import Register from './shared/components/Register';
import Login from './shared/components/Login';
import Home from './shared/components/Home'
import View from './shared/components/View';
import Admin from './shared/components/Admin'
import { authUser } from './shared/functions/login';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // public
      { index: true, element: <Register /> },
      { path: "/login", element: <Login /> },

      // protected
      {
        loader: authUser,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/view/:id", element: <View /> },
          { path: '/admin', element: <Admin />}
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
