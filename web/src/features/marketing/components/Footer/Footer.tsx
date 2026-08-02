import { ReactNode } from 'react';
import Container from '@/components/ui/Container/Container';
import Logo from '@/components/ui/Logo/Logo';
type FooterColumnLink = {
  href: string;
  text: string;
};

interface FooterColumnProps {
  title: string;
  links: FooterColumnLink[];
}

const footerColumnLinkClass =
  'block text-[var(--text-muted)] no-underline text-sm mb-2.5 transition-colors duration-[var(--dur-fast)]';

const footerColumnTitle =
  'text-sm uppercase tracking-[0.06em] font-bold text-[var(--text-dim)] mb-3.5';

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="lp-footer-col">
      <h4 className={footerColumnTitle}>{title}</h4>
      {links.map((link, index) => {
        return (
          <a key={index} className={footerColumnLinkClass} href={link.href}>
            {link.text}
          </a>
        );
      })}
    </div>
  );
}

interface FooterProps {
  columns: FooterColumnProps[];
  branding: ReactNode;
  bottom: {
    startYear?: number;
    company: string;
    slogan: string;
  };
}
const footerClass = 'border-t border-[var(--border)] py-11';
const footerGridClass =
  'flex flex-col gap-9 lg:flex-row lg:justify-between lg:items-start lg:gap-7.5';
const footerBrandingClass = 'lg:max-w-[280px]';
const footerColumnsClass = 'grid grid-cols-3 gap-4 sm:gap-6 lg:flex lg:gap-15 lg:flex-wrap';
const footerBottomClass =
  'mt-9 pt-5 border-t border-[var(--border)] flex justify-between gap-4 flex-wrap text-sm text-[var(--text-dim)]';

function Footer({ columns, branding, bottom }: FooterProps) {
  const { startYear, company, slogan } = bottom;

  const currentYear = new Date().getFullYear();
  const yearsActive = `${startYear}${
    startYear !== currentYear ? ` - ${currentYear}` : ''
  }`;

  return (
    <footer className={footerClass}>
      <Container>
        <div className={footerGridClass}>
          <div className={footerBrandingClass}>{branding}</div>
          <div className={footerColumnsClass}>
            {columns.map((column) => (
              <FooterColumn key={column.title} {...column} />
            ))}
          </div>
        </div>
        <div className={footerBottomClass}>
          <div>{`${yearsActive} ${company}. All rights reserved.`}</div>
          <div>{slogan}</div>
        </div>
      </Container>
    </footer>
  );
}

const footerData: FooterProps = {
  branding: (
    <>
      <Logo href="/" />
      <p>
        The clean, focused way to learn and remember vocabulary in any language.
      </p>
    </>
  ),
  columns: [
    {
      title: 'Product',
      links: [
        { href: '#features', text: 'Features' },
        { href: '#how', text: 'How it works' },
        { href: '#practice', text: 'Practice' },
        { href: '/login', text: 'Open app' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '#top', text: 'About' },
        { href: '#top', text: 'Privacy' },
        { href: '#top', text: 'Terms' },
        { href: '#top', text: 'Contact' },
      ],
    },
    {
      title: 'Learn',
      links: [
        { href: '#top', text: 'French' },
        { href: '#top', text: 'Spanish' },
        { href: '#top', text: 'German' },
        { href: '#top', text: 'Italian' },
      ],
    },
  ],
  bottom: {
    startYear: 2019,
    company: 'LNCD Ltd',
    slogan: 'Made for learners, not streak-chasers.',
  },
};

export { footerData };
export type { FooterProps };
export default Footer;
