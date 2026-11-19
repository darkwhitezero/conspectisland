import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { ProjectsPage } from '../pages/ProjectsPage';
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
      { path: '/', element: <Navigate to="/projects" replace /> },
      { path: '/projects', element: <ProjectsPage /> },
    ],
  },
]);
