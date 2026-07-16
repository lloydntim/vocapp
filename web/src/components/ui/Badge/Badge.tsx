const langBadgeClass =
  'inline-flex items-center gap-1 font-semibold text-[11px] tracking-[0.04em] uppercase px-2 py-[3px] rounded-[6px] bg-(--brand-soft) text-(--brand)';

function Badge({ text }: { text: string }) {
  return <span className={langBadgeClass}>{text}</span>;
}

export default Badge;
