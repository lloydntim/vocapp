import React, {
  ChangeEvent,
  SelectHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Icon from '../Icon/Icon';
import { cn } from '@/lib/utils';
import Button, { ButtonSize } from '../Button/Button';

type SelectOption = {
  value: string;
  label: string;
};

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  icon?: string;
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  className?: string;
  size?: ButtonSize;
}

const optionsBackgroundLayerClass = 'fixed inset-0 z-10';
const optionsContainerClass =
  'absolute top-[calc(100%+6px)] right-0 bg-(--surface) border border-(--border) rounded-[10px] shadow-(--shadow-md) p-1.5 z-[11] min-w-[180px]';

const optionClass =
  'flex items-center gap-3 py-2.5 px-3 rounded-[var(--radius-sm)] text-white-78 cursor-pointer text-[14px] transition-[background,color] duration-[var(--dur-fast)] ease-[var(--ease)] no-border bg-transparent text-left w-full';

function Select({
  icon = '',
  options,
  size,
  onValueChange,
  ...rest
}: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    options[0]?.value as string | null,
  );
  const [activeValue, setActiveValue] = useState<string | null>(selectedValue);
  const [isOpen, setIsOpen] = useState(false);

  const selectValue = useCallback(
    (value: string) => {
      setSelectedValue(value);
      onValueChange?.(value);
    },
    [onValueChange],
  );

  const openDropdown = () => {
    setActiveValue(selectedValue);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const moveActive = (direction: 1 | -1) => {
      if (!activeValue) return;
      const currentIndex = options.findIndex(
        (option) => option.value === activeValue,
      );
      const nextIndex =
        (currentIndex + direction + options.length) % options.length;
      setActiveValue(options[nextIndex].value);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowUp') moveActive(-1);
      if (e.key === 'ArrowDown') moveActive(1);
      if (e.key === 'Enter' || e.key === ' ') {
        if (activeValue) selectValue(activeValue);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, options, activeValue, selectValue]);

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLSelectElement>) => {
    selectValue(value);
    setIsOpen(!isOpen);
  };

  const selectedLabel = options.find(
    (option) => option.value === selectedValue,
  )?.label;

  return (
    <>
      <select className="hidden" {...rest} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="inline-flex relative">
        <Button
          icon={icon}
          rank="secondary"
          size={size}
          onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
        >
          <span>{selectedLabel}</span>
          <Icon type={isOpen ? 'chevron-up' : 'chevron-down'} size={14} />
        </Button>

        <div
          onClick={() => setIsOpen(false)}
          className={cn(optionsBackgroundLayerClass, isOpen ? '' : 'hidden')}
        />

        <div className={cn(optionsContainerClass, isOpen ? '' : 'hidden')}>
          {options.map(({ value, label }) => (
            <Button
              key={value}
              size={size}
              rank="secondary"
              className={cn(
                optionClass,
                'font-light text-(--text) py-2 px-2.5 border-none ',
                activeValue === value && 'bg-(--surface-alt)',
              )}
              onClick={() =>
                handleChange({
                  target: { value },
                } as ChangeEvent<HTMLSelectElement>)
              }
            >
              {label}
              {selectedValue === value && (
                <Icon
                  type="check"
                  size={14}
                  className="text-(--brand) ml-auto"
                />
              )}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}

export default Select;
