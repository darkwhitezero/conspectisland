import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteConspect, renameConspect } from '../../../api/conspects';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { Icon } from '../../../components/Icon';
import { Menu, type MenuItem } from '../../../components/Menu';
import { NameDialog } from '../../../components/NameDialog';
import type { Conspect, ProjectRole } from '../../../types';
import { can } from '../../../utils/permissions';

interface ConspectActionsProps {
  conspect: Conspect;
  role: ProjectRole;
  onRenamed: () => void;
}

/** Меню «⋯» конспекта: «Переименовать» — редактор+, «Удалить конспект» — владелец. */
export function ConspectActions({ conspect, role, onRenamed }: ConspectActionsProps) {
  const [dialog, setDialog] = useState<'rename' | 'delete' | null>(null);
  const navigate = useNavigate();
  const close = () => setDialog(null);

  const candidates: (MenuItem | false)[] = [
    can(role, 'renameConspect') && { label: 'Переименовать', onSelect: () => setDialog('rename') },
    can(role, 'deleteConspect') && { label: 'Удалить конспект', onSelect: () => setDialog('delete'), tone: 'danger' },
  ];
  const items = candidates.filter((item): item is MenuItem => item !== false);
  if (items.length === 0) return null;

  return (
    <>
      <Menu trigger={<Icon name="more" />} triggerLabel="Действия с конспектом" items={items} />

      <NameDialog
        open={dialog === 'rename'}
        onClose={close}
        title="Переименовать конспект"
        label="Название конспекта"
        submitLabel="Сохранить"
        initialValue={conspect.name}
        onSubmit={async (name) => {
          await renameConspect(conspect.id, name);
          close();
          onRenamed();
        }}
      />

      <ConfirmDialog
        open={dialog === 'delete'}
        onClose={close}
        title="Удалить конспект?"
        confirmLabel="Удалить конспект"
        danger
        onConfirm={async () => {
          await deleteConspect(conspect.id);
          navigate(`/projects/${conspect.projectId}`, { replace: true });
        }}
      >
        <p>Конспект «{conspect.name}», его исходные файлы и HTML-представление будут удалены. Отменить это действие нельзя.</p>
      </ConfirmDialog>
    </>
  );
}
