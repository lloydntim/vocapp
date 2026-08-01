import Hero from '@/features/marketing/components/Hero/Hero';
import LanguageStrip, {
  languageStripData,
} from '@/features/marketing/components/LanguageStrip/LanguageStrip';
import FeatureSection, {
  featureSectionData,
} from '@/features/marketing/components/FeaturesSection/FeatureSection';
import ProcessSection, {
  processSectionData,
} from '@/features/marketing/components/ProcessSection/ProcessSection';
import CtaSection, {
  ctaSectionData,
} from '@/features/marketing/components/CtaSection/CtaSection';
import PracticeSection, {
  practiceSectionData,
} from '@/features/marketing/components/PracticeSection/PracticeSection';

export default async function Page() {
  return (
    <main>
      <Hero />
      <LanguageStrip {...languageStripData} />
      <FeatureSection {...featureSectionData} />
      <ProcessSection {...processSectionData} />
      <PracticeSection {...practiceSectionData} />
      <CtaSection {...ctaSectionData} />
    </main>
  );
}
