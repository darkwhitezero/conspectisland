import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireProjectPermission } from '../features/projects/RequireProjectPermission';
import { AuthPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProjectConspectsPage } from '../pages/ProjectConspectsPage';
import { ProjectPage } from '../pages/ProjectPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { StubPage } from '../pages/StubPage';
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
          {
            path: '/projects/:projectId',
            element: <ProjectPage />,
            children: [
              { index: true, element: <ProjectConspectsPage /> },
              { path: 'search', element: <StubPage title="Поиск" /> },
              {
                // Экран «Участники и доступ» — этап 5
                path: 'members',
                element: (
                  <RequireProjectPermission action="manageAccess">
                    <StubPage title="Участники и доступ" />
                  </RequireProjectPermission>
                ),
              },
              {
                path: 'stats',
                element: (
                  <RequireProjectPermission action="viewStats">
                    <StubPage title="Статистика" />
                  </RequireProjectPermission>
                ),
              },
              {
                path: 'conspects/new',
                element: (
                  <RequireProjectPermission action="createConspect">
                    <StubPage title="Новый конспект" />
                  </RequireProjectPermission>
                ),
              },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
