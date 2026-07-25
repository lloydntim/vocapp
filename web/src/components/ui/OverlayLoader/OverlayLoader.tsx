import { cn } from '@/lib/utils';
import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';

interface OverlayLoaderProps {
  title?: string;
  subtitle?: string;
  isContained?: boolean;
}
/*
.overlay-loader {
  position: fixed; inset: 0; z-index: 80;
  display: grid; place-items: center;
  background: color-mix(in oklab, var(--bg) 58%, transparent);
  backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
  animation: fade var(--dur) var(--ease);
}
.overlay-loader.contained { position: absolute; border-radius: inherit; }
.overlay-loader .ol-card {
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  padding: 26px 36px; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.overlay-loader .ol-spin { width: 34px; height: 34px; border-width: 3px; color: var(--brand); }
.overlay-loader .ol-label { font-size: 14px; font-weight: 600; color: var(--text); letter-spacing: -0.01em; }
.overlay-loader .ol-sub { font-size: 12px; color: var(--text-muted); margin-top: -8px; } */

const overlayLoaderClass = `
  absolute fixed inset-0 z-[80] grid place-items-center
  bg-[color-mix(in_oklab,var(--bg)_58%,transparent)] backdrop-blur-[2px]
  animate-[fade_var(--dur)_var(--ease)]
`;
const overlayCardClass =
  'rounded-lg gap-3.5 py-6.5 px-9 shadow-(--shadow-mg) flex flex-col items-center';
const overlayTitleClass =
  'text-[14px] font-semibold text-(--text) tracking-[-0.01em]';
const overlaySubtitleClass = 'text-[12px] text-(--text-muted) mt-[-8px]';

function OverlayLoader({
  title = 'Loading…',
  subtitle,
  isContained,
}: OverlayLoaderProps) {
  return (
    <div
      className={cn(
        overlayLoaderClass,
        isContained ? 'absolute rounded-[inherit]' : '',
      )}
      role="status"
      aria-live="polite"
    >
      <Card hasShadow hasBorder className={overlayCardClass}>
        <Spinner size="large" className="text-(--brand)" />
        <div className={overlayTitleClass}>{title}</div>
        {subtitle && <div className={overlaySubtitleClass}>{subtitle}</div>}
      </Card>
    </div>
  );
}

export default OverlayLoader;
