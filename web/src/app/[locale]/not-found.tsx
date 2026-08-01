import Button from '@/components/ui/Button/Button';
import Headline from '@/components/ui/Headline/Headline';
import Logo from '@/components/ui/Logo/Logo';
import Header from '@/features/marketing/components/Header/Header';
import Text from '@/components/ui/Text/Text';
import { cn } from '@/lib/utils';

const errorPageClass = 'min-h-screen flex flex-col bg-(--bg) text-(--text)';
const errorPageMainClass = 'flex flex-1 items-center justify-center py-10 px-6';

const errorPageLinkGroupClass = 'flex gap-2 justify-center flex-wrap';
const errorCodeClass =
  'font-mono text-[96px] font-bold text-[var(--brand)] mb-2 leading-[1]';
const errorPageHeadingClass = 'text-[22px] font-bold mb-2 tracking-[-0.01em]';
const errorPageSubheadingClass =
  'text-(--text-muted) leading-[1.6] mb-8 text-wrap-pretty';

const errorPageContentClass = 'text-center max-w-[560px]';
const fadeInClass = 'animate-fade-in duration-(--dur) ease-(--ease)';

function NotFound() {
  return (
    <div className={errorPageClass}>
      <Header logo={<Logo />} />
      <main className={errorPageMainClass}>
        <div className={cn(errorPageContentClass, fadeInClass)}>
          <div className={errorCodeClass}>404</div>
          <Headline className={errorPageHeadingClass} level="h1">
            This list doesn&apos;t exist
          </Headline>
          <Text className={errorPageSubheadingClass}>
            The page you&apos;re looking for may have been moved, renamed, or
            never existed. Check the address, or head back to your dashboard.
          </Text>
          <div className={errorPageLinkGroupClass}>
            <Button
              rank="primary"
              className="underline"
              icon="house"
              size="large"
              to="/"
              isLink
            >
              Back to dashboard
            </Button>
            <Button
              rank="secondary"
              className="underline"
              to="/"
              size="large"
              isLink
            >
              Go to homepage
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
