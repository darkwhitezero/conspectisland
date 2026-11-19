import { EmptyState } from '../../components/EmptyState';

/** Заглушка для экранов, которые появятся позже (domain.md, раздел 10). */
export function StubPage({ title }: { title: string }) {
  return <EmptyState title={title} description="Этот раздел появится в следующей версии." />;
}
