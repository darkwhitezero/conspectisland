import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProject, forkProject, leaveProject, renameProject } from '../../../api/projects';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Icon } from '../../../components/Icon';
import { Menu, type MenuItem } from '../../../components/Menu';
import { NameDialog } from '../../../components/NameDialog';
import type { Project } from '../../../types';
import { can } from '../../../utils/permissions';
import { useMyProjects } from '../MyProjectsProvider';

type DialogKind = 'rename' | 'delete' | 'fork' | 'leave' | null;

interface ProjectActionsProps {
  project: Project;
  onRenamed: () => void;
}

/** Меню «⋯» в шапке проекта; набор пунктов зависит от роли. */
export function ProjectActions({ project, onRenamed }: ProjectActionsProps) {
  const [dialog, setDialog] = useState<DialogKind>(null);
  const navigate = useNavigate();
  const myProjects = useMyProjects();
  const close = () => setDialog(null);
  const role = project.myRole;

  /** После удаления или выхода проекта у пользователя больше нет. */
  const goToMyProjects = () => {
    myProjects.reload();
    navigate('/projects', { replace: true });
  };

  const candidates: (MenuItem | false)[] = [
    can(role, 'renameProject') && { label: 'Переименовать', onSelect: () => setDialog('rename') },
    can(role, 'fork') && { label: 'Создать форк', onSelect: () => setDialog('fork') },
    can(role, 'leaveProject') && { label: 'Покинуть проект', onSelect: () => setDialog('leave'), tone: 'danger' },
    can(role, 'deleteProject') && { label: 'Удалить проект', onSelect: () => setDialog('delete'), tone: 'danger' },
  ];
  const items = candidates.filter((item): item is MenuItem => item !== false);

  return (
    <>
      <Menu trigger={<Icon name="more" />} triggerLabel="Действия с проектом" items={items} />

      <NameDialog
        open={dialog === 'rename'}
        onClose={close}
        title="Переименовать проект"
        label="Название проекта"
        submitLabel="Сохранить"
        initialValue={project.name}
        onSubmit={async (name) => {
          await renameProject(project.id, name);
          close();
          onRenamed();
          myProjects.reload();
        }}
      />

      <NameDialog
        open={dialog === 'fork'}
        onClose={close}
        title="Создать форк"
        label="Название форка"
        submitLabel="Создать форк"
        initialValue={project.name}
        description="Форк — независимая копия проекта со всеми конспектами. Её владельцем станете вы, участники не копируются."
        onSubmit={async (name) => {
          const fork = await forkProject(project.id, name);
          close();
          myProjects.reload();
          navigate(`/projects/${fork.id}`);
        }}
      />

      <ConfirmDialog
        open={dialog === 'leave'}
        onClose={close}
        title="Покинуть проект?"
        confirmLabel="Покинуть проект"
        danger
        onConfirm={async () => {
          await leaveProject(project.id);
          goToMyProjects();
        }}
      >
        <p>
          Проект «{project.name}» пропадёт из ваших проектов. Вернуться можно по действующей ссылке-приглашению.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'delete'}
        onClose={close}
        title="Удалить проект?"
        confirmLabel="Удалить проект"
        danger
        onConfirm={async () => {
          await deleteProject(project.id);
          goToMyProjects();
        }}
      >
        <p>Проект «{project.name}» и все его конспекты будут удалены. Отменить это действие нельзя.</p>
      </ConfirmDialog>
    </>
  );
}
