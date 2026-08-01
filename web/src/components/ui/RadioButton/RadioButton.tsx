import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
}

const radioButtonClass =
  'flex items-center h-8 px-[14px] no-border bg-transparent text-(--text-muted) text-[13px] font-medium rounded-[7px] cursor-pointer transition-all duration-(--dur-fast) ease-(--ease)';

const isCheckedClass = 'bg-(--surface) text-(--text) shadow-(--shadow-sm)';

function RadioButton({
  id,
  name,
  label,
  className,
  checked,
  ...props
}: RadioButtonProps) {
  return (
    <label
      className={cn(radioButtonClass, checked && isCheckedClass, className)}
      htmlFor={id}
    >
      <input
        className="hidden"
        type="radio"
        checked={checked}
        id={id}
        name={name}
        {...props}
      />
      <>{label}</>
    </label>
  );
}

export type { RadioButtonProps };
export default RadioButton;
