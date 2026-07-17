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
}: ButtonGroupProps<T>) {
  const ButtonComponent = typeMap[type ?? 'button'] as ComponentType<
    (typeof buttons)[number]
  >;
  // flex-1 (flex-basis: 0%) sizes buttons along the main axis, so it only
  // gives equal widths when that axis is horizontal. In a column stack the
  // main axis is vertical, and flex-basis: 0% would collapse each button's
  // explicit height instead — use w-full there so height stays intact.
  const itemSizeClass = direction === 'col' ? 'w-full' : 'flex-1';

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
