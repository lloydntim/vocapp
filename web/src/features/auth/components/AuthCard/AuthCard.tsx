import Headline from '@/components/ui/Headline/Headline';
import Text from '@/components/ui/Text/Text';
import { ReactNode } from 'react';

interface AuthCardProps {
  header: {
    title: string;
    subtitle?: string;
  };
  hasDivider?: boolean;
  dividerText?: string;
  footer?: ReactNode;
  content?: ReactNode;
}

const authCardClass = 'max-w-[380px] w-full m-auto py-12';
const authCardHeaderClass = 'm-1';
const authCardTitleClass = 'text-[28px] font-bold tracking-[-0.02em] mb-2';
const authCardSubtitleClass = 'text-wrap-pretty leading-[1.66] mb-6.5';
const authCardFooterClass = 'text-center mt-4';

const authDividerClass =
  'flex items-center gap-3 text-(--text-dim) text-xs mt-5 mb-0.5 uppercase tracking-[0.06em]';
const authDividerLineClass = 'flex-1 h-px bg-(--border)';

function AuthCard({
  header: { title, subtitle },
  hasDivider,
  dividerText,
  footer,
  content,
}: AuthCardProps) {
  return (
    <div className={authCardClass}>
      <div className={authCardHeaderClass}>
        <Headline className={authCardTitleClass} level="h1">
          {title}
        </Headline>
        {subtitle && <Text className={authCardSubtitleClass}>{subtitle}</Text>}
      </div>
      {content}
      {hasDivider && (
        <div className={authDividerClass}>
          <span className={authDividerLineClass} />
          {dividerText}
          <span className={authDividerLineClass} />
        </div>
      )}
      {footer && <div className={authCardFooterClass}>{footer}</div>}
    </div>
  );
}

export default AuthCard;
