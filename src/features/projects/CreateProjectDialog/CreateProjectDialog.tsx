import { createProject } from '../../../api/projects';
import { NameDialog } from '../../../components/NameDialog';
import type { Project } from '../../../types';

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (project: Project) => void;
}

export function CreateProjectDialog({ open, onClose, onCreated }: CreateProjectDialogProps) {
  return (
    <NameDialog
      open={open}
      onClose={onClose}
      title="Создать проект"
      label="Название проекта"
      submitLabel="Создать"
      onSubmit={async (name) => onCreated(await createProject(name))}
    />
  );
}
