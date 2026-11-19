import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';

export function NotFoundPage() {
  return (
    <>
      <title>Страница не найдена — ConspectIsland</title>
      <EmptyState
        title="Страница не найдена"
        description="Возможно, адрес набран с ошибкой или страница была удалена."
        action={<Link to="/projects">Мои проекты</Link>}
      />
    </>
  );
}
