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

interface ButtonGroupProps<T extends ButtonGroupType> {
  className?: string;
  style?: CSSProperties;
  buttons: ButtonItemProps<T>[];
  size?: 'small' | 'base' | 'large';
  variant?: ButtonVariant;
  type?: T;
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
}: ButtonGroupProps<T>) {
  const ButtonComponent = typeMap[type ?? 'button'] as ComponentType<
    (typeof buttons)[number]
  >;
  return (
    <div className={cn('flex gap-2', className)} style={style}>
      {buttons.map((props, index) => {
        return (
          <ButtonComponent
            key={index}
            {...{
              ...props,
              className: cn('flex-1', props.className),
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
