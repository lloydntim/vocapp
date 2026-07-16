import IconButton from '@/components/ui/IconButton/IconButton';

interface ProfileDetailCardRow {
  label: string;
  value: string;
  action?: () => void;
}

const profileDetailCardRowClass =
  'grid grid-cols-[160px_1fr_auto] items-center py-3.5 border-b border-(--border) text-[14px] last:border-b-0';

function ProfileDetailsCardRow({ label, value, action }: ProfileDetailCardRow) {
  return (
    <div className={profileDetailCardRowClass}>
      <div className="text-(--text-muted)">{label}</div>
      <div className="text-(--text) font-medium">{value}</div>
      {action && (
        <IconButton
          variant="ghost"
          icon="pen-line"
          size="small"
          title={`Edit ${label.toLowerCase()}`}
          onClick={action}
        />
      )}
    </div>
  );
}

export type { ProfileDetailCardRow };
export default ProfileDetailsCardRow;
