import AuthVisualsColumn from '@/features/auth/components/AuthVisualsColumn/AuthVisualsColumn';
import { PropsWithChildren } from 'react';

const authPageClass = 'min-h-dvh flex bg-(--bg) text-(--text)';

function layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className={authPageClass}>
      {children}

      <AuthVisualsColumn />
    </div>
  );
}

export default layout;
