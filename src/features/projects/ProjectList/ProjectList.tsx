import type { Project } from '../../../types';
import { ProjectListItem } from '../ProjectListItem';
import styles from './ProjectList.module.css';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className={styles.list}>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </ul>
  );
}
