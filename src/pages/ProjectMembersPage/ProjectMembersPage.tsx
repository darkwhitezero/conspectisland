import { useCallback, useId, useState } from 'react';
import { errorMessage } from '../../api/client';
import { getAccess, listMembers, setAccessPolicy } from '../../api/members';
import { Alert } from '../../components/Alert';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { AccessPolicyControl } from '../../features/members/AccessPolicyControl';
import { InviteLinkField } from '../../features/members/InviteLinkField';
import { MemberList } from '../../features/members/MemberList';
import { useCurrentProject } from '../../features/projects/currentProject';
import type { AccessPolicy } from '../../types';
import { useAsync } from '../../utils/useAsync';
import styles from './ProjectMembersPage.module.css';

/** Вкладка «Участники и доступ» — только владелец (guard в маршруте). */
export function ProjectMembersPage() {
  const { project, reloadProject } = useCurrentProject();
  const accessTitleId = useId();
  const membersTitleId = useId();
  const load = useCallback(
    () => Promise.all([getAccess(project.id), listMembers(project.id)]).then(([access, members]) => ({ access, members })),
    [project.id],
  );
  const { status, data, error, reload } = useAsync(load);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [confirmPrivate, setConfirmPrivate] = useState(false);

  const applyPolicy = async (policy: AccessPolicy) => {
    await setAccessPolicy(project.id, policy);
    setOperationError(null);
    reload();
    reloadProject();
  };

  const handlePolicyChange = async (policy: AccessPolicy) => {
    // «Только владелец» удаляет участников — только после подтверждения.
    if (policy === 'PRIVATE') {
      setConfirmPrivate(true);
      return;
    }
    try {
      await applyPolicy(policy);
    } catch (failure) {
      setOperationError(errorMessage(failure));
    }
  };

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    );
  }
  if (status === 'error') return <Alert>{error}</Alert>;

  const { access, members } = data;

  return (
    <div className={styles.page}>
      {operationError && <Alert>{operationError}</Alert>}

      <section className={styles.section} aria-labelledby={accessTitleId}>
        <h2 id={accessTitleId} className={styles.title}>
          Политика доступа
        </h2>
        <AccessPolicyControl value={access.accessPolicy} onChange={handlePolicyChange} />
        {access.inviteLink && <InviteLinkField link={access.inviteLink} />}
      </section>

      <section className={styles.section} aria-labelledby={membersTitleId}>
        <h2 id={membersTitleId} className={styles.title}>
          Участники{members.length > 0 && <span className={styles.count}> · {members.length}</span>}
        </h2>
        {members.length > 0 ? (
          <MemberList
            projectId={project.id}
            members={members}
            onChanged={() => {
              setOperationError(null);
              reload();
            }}
            onError={setOperationError}
          />
        ) : (
          <EmptyState
            title="Участников пока нет"
            description={
              access.accessPolicy === 'LINK'
                ? 'Отправьте ссылку-приглашение одногруппникам — присоединившиеся появятся здесь.'
                : 'Чтобы пригласить одногруппников, выберите политику «По ссылке».'
            }
          />
        )}
      </section>

      <ConfirmDialog
        open={confirmPrivate}
        onClose={() => setConfirmPrivate(false)}
        title="Сделать проект закрытым?"
        confirmLabel="Только владелец"
        danger
        onConfirm={async () => {
          await applyPolicy('PRIVATE');
          setConfirmPrivate(false);
        }}
      >
        <p>Все участники будут удалены из проекта, а ссылка-приглашение перестанет работать.</p>
      </ConfirmDialog>
    </div>
  );
}
