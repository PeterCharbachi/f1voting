import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Scoreboard from './pages/Scoreboard.tsx';
import Admin from './pages/Admin.tsx';
import Info from './pages/Info.tsx'; // Import Info component
import { AuthProvider } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import AdminRoute from './components/auth/AdminRoute.tsx';
import RedirectIfAuth from './components/auth/RedirectIfAuth.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      { path: 'scoreboard', element: <Scoreboard /> },
      { path: 'info', element: <Info /> },
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [{ index: true, element: <Admin /> }],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);