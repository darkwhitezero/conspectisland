import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { AppLayout } from './AppLayout';
import { GuestOnly, RequireAuth } from './RequireAuth';

export const router = createBrowserRouter([
  {
    element: <GuestOnly />,
    children: [
      { path: '/login', element: <AuthPage mode="login" /> },
      { path: '/register', element: <AuthPage mode="register" /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/projects" replace /> },
          { path: '/projects', element: <ProjectsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
