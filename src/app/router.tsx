import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireProjectPermission } from '../features/projects/RequireProjectPermission';
import { AccountPage } from '../pages/AccountPage';
import { AuthPage } from '../pages/AuthPage';
import { ConspectPage } from '../pages/ConspectPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProjectConspectsPage } from '../pages/ProjectConspectsPage';
import { ProjectMembersPage } from '../pages/ProjectMembersPage';
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
                path: 'members',
                element: (
                  <RequireProjectPermission action="manageAccess">
                    <ProjectMembersPage />
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
          { path: '/account', element: <AccountPage /> },
          // Конспект — отдельный экран без шапки и вкладок проекта
          { path: '/projects/:projectId/conspects/:conspectId', element: <ConspectPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
