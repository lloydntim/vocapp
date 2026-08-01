import Footer, {
  footerData,
} from '@/features/marketing/components/Footer/Footer';
import { PropsWithChildren } from 'react';
import Header, {
  headerData,
} from '@/features/marketing/components/Header/Header';

function layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <Header {...headerData} />
      <div className="bg-background text-foreground">{children}</div>
      <Footer {...footerData} />
    </>
  );
}

export default layout;
