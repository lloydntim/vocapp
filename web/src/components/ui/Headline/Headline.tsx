import { cn } from '@/lib/utils';
import React, { CSSProperties, PropsWithChildren } from 'react';

// import createStylesProps from '../../helpers/createStyledProps';

// import { withLocalisation } from '../../hoc';
// import { TextProps } from '../Text/Text';

type HeadlineLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

type HeadlineObject = {
  el: HeadlineLevel;
  className: string;
};

export interface HeadlineProps extends PropsWithChildren {
  strong?: boolean;
  className?: string;
  level?: HeadlineLevel;
  style?: CSSProperties;
}

const headlineMapper: Record<HeadlineLevel, HeadlineObject> = {
  h1: {
    el: 'h1',
    className:
      'leading-[1.04] tracking-[-0.035em] font-extrabold mb-5.5 text-balance text-[44px]',
  },
  h2: {
    el: 'h2',
    className:
      'leading-[1.1] tracking-[-0.03em] font-extrabold mb-3.5 text-balance text-[40px]',
  },
  h3: {
    el: 'h3',
    className: 'text-[18px] font-bold mb-2 tracking-[-0.01em]',
  },
  h4: {
    el: 'h4',
    className: 'text-[13px] tracking-[0.06em] mb-3.5',
  },
  h5: {
    el: 'h5',
    className: '',
  },
};
const Headline = ({ children, level = 'h1', className }: HeadlineProps) => {
  const { el: HeadlineElement, className: headlineClassName } =
    headlineMapper[level];

  return (
    <HeadlineElement className={cn(headlineClassName, className)}>
      {children}
    </HeadlineElement>
  );
};

// export default withLocalisation<HeadlineProps>(Headline);

export default Headline;
