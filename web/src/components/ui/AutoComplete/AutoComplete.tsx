'use client';

import { ChangeEvent, FocusEvent, Ref, useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import InputField, { InputFieldProps } from '../InputField/InputField';
import { cn } from '@/lib/utils';

export interface AutoCompleteItem {
  value: string | number | boolean;
  text: string;
}

interface AutoCompleteProps extends Omit<
  InputFieldProps,
  'value' | 'onChange' | 'onSelect'
> {
  ref?: Ref<HTMLInputElement>;
  value: string;
  dataList?: AutoCompleteItem[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelect: (item: AutoCompleteItem) => void;
}

const optionsContainerClass =
  'absolute top-[calc(100%+6px)] left-0 right-0 bg-(--surface) border border-(--border) rounded-[10px] shadow-(--shadow-md) p-1.5 z-[11] max-h-60 overflow-auto';
const optionClass =
  'flex items-center gap-1 py-2 px-2.5 rounded-[var(--radius-sm)] text-(--text) cursor-pointer text-sm font-light transition-[background,color] duration-(--dur-fast) ease-(--ease) bg-transparent border-none text-left w-full justify-start';

function AutoComplete({
  value,
  dataList,
  onChange,
  onSelect,
  size,
  ref,
  ...rest
}: AutoCompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredItems =
    dataList?.filter(
      (item) =>
        value.length > 0 &&
        item.text.toLowerCase().startsWith(value.toLowerCase()),
    ) ?? [];

  const selectItem = (item: AutoCompleteItem) => {
    setIsOpen(false);
    onSelect(item);
  };

  useEffect(() => {
    if (!isOpen) return;

    const moveActive = (direction: 1 | -1) => {
      if (filteredItems.length === 0) return;
      setActiveIndex((current) => {
        const currentIndex = current ?? -1;
        return (
          (currentIndex + direction + filteredItems.length) %
          filteredItems.length
        );
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActive(1);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActive(-1);
      }
      if (event.key === 'Enter' && activeIndex !== null) {
        const activeItem = filteredItems[activeIndex];
        if (activeItem) selectItem(activeItem);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filteredItems, activeIndex]);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    setActiveIndex(null);
    onChange(event);
  };

  // Close when focus leaves this component entirely (e.g. clicking or
  // tabbing into another field) — but not when it moves to a suggestion
  // button, which is still inside our own container.
  const blurHandler = (event: FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef} onBlur={blurHandler}>
      <InputField
        ref={ref}
        {...rest}
        size={size}
        value={value}
        onChange={changeHandler}
      />

      {isOpen && filteredItems.length > 0 && (
        <ul className={optionsContainerClass}>
          {filteredItems.map((item, index) => {
            const boldText = item.text.substring(0, value.length);
            const normalText = item.text.substring(value.length);
            return (
              <li key={item.value.toString()}>
                <Button
                  tabIndex={-1}
                  size={size}
                  rank="secondary"
                  className={cn(
                    optionClass,
                    activeIndex === index && 'bg-(--surface-alt)',
                  )}
                  onClick={() => selectItem(item)}
                >
                  <span>
                    <span className="font-semibold">{boldText}</span>
                    {normalText}
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AutoComplete;
