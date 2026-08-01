import { ComponentType, CSSProperties } from 'react';
import IconButton, { IconButtonProps } from '../IconButton/IconButton';
import Button, { ButtonProps, ButtonVariant } from '../Button/Button';
import { cn } from '@/lib/utils';

type ButtonGroupType = 'icon' | 'button';
type ButtonItemProps<T extends ButtonGroupType> = Omit<
  T extends 'icon' ? IconButtonProps : ButtonProps,
  'children'
> & {
  label?: string;
};

type ButtonGroupDirection = 'row' | 'col';

interface ButtonGroupProps<T extends ButtonGroupType> {
  className?: string;
  style?: CSSProperties;
  buttons: ButtonItemProps<T>[];
  size?: 'small' | 'base' | 'large';
  variant?: ButtonVariant;
  type?: T;
  direction?: ButtonGroupDirection;
  /** Set false so buttons size to their own content instead of
   * stretching to match each other. */
  stretch?: boolean;
}

const typeMap = {
  icon: IconButton,
  button: Button,
};

function ButtonGroup<T extends ButtonGroupType>({
  buttons,
  type,
  className,
  style,
  size = 'base',
  variant: buttonGroupVariant = 'standard',
  direction = 'row',
  stretch = true,
}: ButtonGroupProps<T>) {
  const ButtonComponent = typeMap[type ?? 'button'] as ComponentType<
    (typeof buttons)[number]
  >;
  // flex-1's flex-basis: 0% sizes buttons along the main axis, which is
  // vertical in a column — use w-full there instead so height isn't collapsed.
  const itemSizeClass = stretch && (direction === 'col' ? 'w-full' : 'flex-1');

  return (
    <div
      className={cn('flex gap-2', direction === 'col' && 'flex-col', className)}
      style={style}
    >
      {buttons.map((props, index) => {
        return (
          <ButtonComponent
            key={index}
            {...{
              ...props,
              className: cn(itemSizeClass, props.className),
              children: props.label,
              size,
              variant: props.variant ?? buttonGroupVariant,
            }}
          />
        );
      })}
    </div>
  );
}

export type { ButtonGroupType, ButtonItemProps };
export default ButtonGroup;
