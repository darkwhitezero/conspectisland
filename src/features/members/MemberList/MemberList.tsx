import { useState } from 'react';
import { errorMessage } from '../../../api/client';
import { changeMemberRole, removeMember } from '../../../api/members';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import type { ProjectMember } from '../../../types';
import { MemberRow } from '../MemberRow';
import styles from './MemberList.module.css';

interface MemberListProps {
  projectId: string;
  members: ProjectMember[];
  onChanged: () => void;
  onError: (message: string) => void;
}

/** Участники: смена роли «Редактор» / «Читатель» и исключение с подтверждением. */
export function MemberList({ projectId, members, onChanged, onError }: MemberListProps) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<ProjectMember | null>(null);

  const handleRoleChange = async (member: ProjectMember, role: ProjectMember['role']) => {
    setSavingId(member.userId);
    try {
      await changeMemberRole(projectId, member.userId, role);
      onChanged();
    } catch (error) {
      onError(errorMessage(error));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <ul className={styles.list}>
        {members.map((member) => (
          <MemberRow
            key={member.userId}
            member={member}
            saving={savingId === member.userId}
            onRoleChange={(role) => handleRoleChange(member, role)}
            onRemove={() => setRemoving(member)}
          />
        ))}
      </ul>

      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title="Исключить участника?"
        confirmLabel="Исключить"
        danger
        onConfirm={async () => {
          if (!removing) return;
          await removeMember(projectId, removing.userId);
          setRemoving(null);
          onChanged();
        }}
      >
        <p>
          {removing?.login} потеряет доступ к проекту. Вернуться можно по действующей ссылке-приглашению — с ролью
          «Читатель».
        </p>
      </ConfirmDialog>
    </>
  );
}
