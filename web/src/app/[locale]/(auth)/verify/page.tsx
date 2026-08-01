'use client';

import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from '@/components/ui/Link/Link';
import Text from '@/components/ui/Text/Text';
import AuthCard from '@/features/auth/components/AuthCard/AuthCard';
import AuthFormColumn from '@/features/auth/components/AuthFormColumn/AuthFormColumn';
import Icon from '@/components/ui/Icon/Icon';
import ButtonGroup from '@/components/ui/ButtonGroup/ButtonGroup';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { getOpenEmailAppUrl } from '@/features/auth/lib/webmail';
import { ReactNode } from 'react';

const authHeaderLinkText = (
  <Text>
    Wrong address? <Link href="/signup">Start over</Link>
  </Text>
);

const ANIMATED_ICON_SIZE = 34;

const animateIconContainerClass =
  "size-19 rounded-[22px] mx-auto mb-5.5 grid place-items-center relative bg-(--brand-soft) text-(--brand) animate-[confirm-pop_420ms_var(--ease)_both] after:content-[''] after:absolute after:-inset-[8px] after:rounded-[28px] after:border-[length:1.5px] after:border-[color:color-mix(in_oklab,var(--brand)_30%,transparent)] after:opacity-0 after:animate-[confirm-ring_1800ms_var(--ease)_200ms_infinite]";

const AnimatedIcon = ({
  icon,
  variant,
}: {
  icon: string;
  variant?: 'success' | 'danger' | 'warn';
}) => {
  const variantMap = {
    success: 'bg-(--brand-soft) text-(--brand)',
    danger: 'bg-(--danger-soft) text-(--danger)',
    warn: 'bg-(--warn-soft) text-(--warn)',
  };

  const iconClass = variant ? variantMap[variant] : '';

  return (
    <div className={cn(animateIconContainerClass, iconClass)}>
      <Icon type={icon} size={ANIMATED_ICON_SIZE} />
    </div>
  );
};

interface StepsCardProps {
  title: string;
  steps: ReactNode[];
}

const stepNumberClass =
  'flex-[0_0_24px] size-6 rounded-[8px] bg-(--brand) text-(--brand-ink) grid place-items-center text-[12px] font-semibold';

const stepsCardClass = 'flex p-4 mt-5.5 text-left flex-col gap-3.5';
const stepsCardTitleClass =
  'text-[12px] font-semibold tracking-[0.06em] text-(--text-dim) uppercase';

const buttonAsTextStyle = cn(
  'text-(--brand) font-medium border-transparent bg-transparent m-0 p-0',
  'hover:underline',
);

function StepsCard({ title, steps }: StepsCardProps) {
  return (
    <Card hasBorder className={stepsCardClass}>
      <div className={stepsCardTitleClass}>{title}</div>
      {steps.map((step, index) => (
        <div className="flex gap-3 flex-start" key={index}>
          <div className={stepNumberClass}>{index + 1}</div>
          <div className="leading-normal text-(--text-muted) text-[13.5px]">
            {step}
          </div>
        </div>
      ))}
    </Card>
  );
}

function VerifyPage() {
  const email = useSearchParams().get('email');
  const openEmailAppUrl = getOpenEmailAppUrl(email);

  return (
    <AuthFormColumn authHeaderLink={authHeaderLinkText}>
      <AuthCard
        header={{
          title: 'Check your inbox',
          subtitle:
            "We've sent a verification link to confirm your account. Click the link in the email to get started.",
        }}
        content={
          <div className="auth-card auth-confirm">
            <AnimatedIcon icon="mail" variant="success" />

            <ButtonGroup
              type="button"
              direction="col"
              className="gap-2.5"
              size="base"
              buttons={[
                {
                  label: 'Open email app',
                  to: openEmailAppUrl,
                  target: '_blank',
                  rel: 'noopener',
                  isLink: true,
                  className: 'underline',
                },
                {
                  rank: 'secondary',
                  label: 'Back to log in',
                  to: '/login',
                  isLink: true,
                  className: 'underline',
                },
              ]}
            />

            <StepsCard
              title="What happens next"
              steps={[
                <>
                  Open the email from{' '}
                  <strong className="text-(--text)">VocApp</strong>&nbsp;, check
                  spam if it&apos;s not in your inbox.
                </>,
                <>
                  Tap <strong className="text-(--text)">Verify email</strong> to
                  activate your account.
                </>,
                <>
                  You&apos;ll land straight in the app, ready to build your
                  first list.
                </>,
              ]}
            />
          </div>
        }
        footer={
          <Text>
            Didn&apos;t get it?{' '}
            <Button className={buttonAsTextStyle} onClick={() => {}}>
              Resend email
            </Button>
          </Text>
        }
      />
    </AuthFormColumn>
  );
}

export default VerifyPage;
