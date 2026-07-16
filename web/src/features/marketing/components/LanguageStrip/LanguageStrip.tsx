import Container from '@/components/ui/Container/Container';

interface LanguageStripProps {
  title: string;
  languages: { flag?: string; name: string }[];
}

const languageStripData = {
  title: 'Available in multiple languages',
  languages: [
    { flag: '🇪🇸', name: 'Spanish' },
    { flag: '🇩🇪', name: 'German' },
    { flag: '🇮🇹', name: 'Italian' },
    { flag: '🇬🇧', name: 'English' },
    { flag: '', name: '+more' },
  ],
};

const stripClass = 'lp-strip py-2 pb-10 text-center';
const stripLabelClass =
  'text-sm tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4';
const stripLangsClass = 'flex flex-wrap justify-center gap-3';
const stripLangClass =
  'inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm font-medium text-[var(--text-muted)]';

function LanguageStrip({ title, languages }: LanguageStripProps) {
  return (
    <div className={stripClass}>
      <Container>
        <div className={stripLabelClass}>{title}</div>
        <div className={stripLangsClass}>
          {languages.map((lang, index) => (
            <span key={index} className={stripLangClass}>
              {lang.flag} {lang.name}
            </span>
          ))}
        </div>
      </Container>
    </div>
  );
}

export { languageStripData };
export default LanguageStrip;
