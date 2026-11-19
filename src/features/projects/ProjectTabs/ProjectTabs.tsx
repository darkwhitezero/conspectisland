import { Tabs, type TabItem } from '../../../components/Tabs';
import type { Project } from '../../../types';
import { can, type ProjectAction } from '../../../utils/permissions';

const TABS: (Omit<TabItem, 'to'> & { path: string; action: ProjectAction })[] = [
  { label: 'Конспекты', path: '', end: true, action: 'viewConspects' },
  { label: 'Поиск', path: 'search', action: 'search' },
  { label: 'Участники и доступ', path: 'members', action: 'manageAccess' },
  { label: 'Статистика', path: 'stats', action: 'viewStats' },
];

/** Вкладки проекта; «Участники и доступ» и «Статистику» видит только владелец. */
export function ProjectTabs({ project }: { project: Project }) {
  const base = `/projects/${project.id}`;
  const items = TABS.filter((tab) => can(project.myRole, tab.action)).map(({ label, path, end }) => ({
    label,
    end,
    to: path ? `${base}/${path}` : base,
  }));

  return <Tabs label="Разделы проекта" items={items} />;
}
