import Container from '@/components/ui/Container/Container';
import HeroVisual, { heroVisualData } from './HeroVisual';
import HeroCopy, { heroCopyContent } from './HeroCopy';

const heroClass = 'pt-14 pb-12';
const heroGridClass =
  'grid z-1 relative grid-cols-[1.05fr_1fr] gap-12 items-center';

function Hero() {
  return (
    <section className={heroClass}>
      <Container className={heroGridClass}>
        <HeroCopy {...heroCopyContent} />

        <HeroVisual {...heroVisualData} />
      </Container>
    </section>
  );
}

export default Hero;
