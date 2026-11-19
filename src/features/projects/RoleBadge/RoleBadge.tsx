import { Badge, type BadgeTone } from '../../../components/Badge';
import type { ProjectRole } from '../../../types';
import { PROJECT_ROLE_LABELS } from '../../../utils/labels';

const TONES: Record<ProjectRole, BadgeTone> = {
  owner: 'primary',
  editor: 'info',
  reader: 'neutral',
};

export function RoleBadge({ role }: { role: ProjectRole }) {
  return <Badge tone={TONES[role]}>{PROJECT_ROLE_LABELS[role]}</Badge>;
}
