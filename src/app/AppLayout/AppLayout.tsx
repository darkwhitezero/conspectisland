import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MyProjectsProvider } from '../../features/projects/MyProjectsProvider';
import { useMediaQuery, WIDE_NAV_QUERY } from '../../utils/useMediaQuery';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import { Sidebar } from './Sidebar';
import styles from './AppLayout.module.css';

/** Общий каркас экранов после входа: шапка, навигация и содержимое. */
export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isWide = useMediaQuery(WIDE_NAV_QUERY);

  return (
    <MyProjectsProvider>
      <a className={styles.skipLink} href="#main">
        Перейти к содержимому
      </a>
      <Header onMenuClick={() => setDrawerOpen(true)} />
      <div className={styles.body}>
        <Sidebar />
        <main id="main" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      {/* Если окно расширили при открытом меню, оно закрывается: дальше есть боковая панель */}
      <NavDrawer open={drawerOpen && !isWide} onClose={() => setDrawerOpen(false)} />
    </MyProjectsProvider>
  );
}
