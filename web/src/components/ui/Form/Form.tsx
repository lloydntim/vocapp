import { Ref } from 'react';
import Button from '@/components/ui/Button/Button';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import InputField from '@/components/ui/InputField/InputField';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

import {
  FieldPath,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

const authFormClass = 'flex flex-col gap-4';

interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  error?: string;
  icon?: string;
  hint?: string;
  showPasswordStrength?: boolean;
  ref?: Ref<HTMLInputElement>;
}

function Input({
  id,
  label,
  placeholder,
  autoComplete,
  type,
  error,
  icon,
  ref,
  ...rest
}: InputProps) {
  if (type === 'checkbox') {
    return <Checkbox ref={ref} id={id} label={label} error={error} {...rest} />;
  }
  return (
    <InputField
      ref={ref}
      id={id}
      label={label}
      placeholder={placeholder}
      autoComplete={autoComplete}
      type={type}
      error={error}
      icon={icon}
      {...rest}
    />
  );
}

export type InputDataItem<T extends FieldValues> = {
  schemaKey: FieldPath<T>;
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  icon?: string;
  hint?: string;
  showPasswordStrength?: boolean;
};

interface FormProps<T extends FieldValues> {
  fields: InputDataItem<T>[];
  schema: ZodType<T, T>;
  submitButtonText: string;
  submitButtonHandler: SubmitHandler<T>;
  isSubmitting?: boolean;
}

function Form<T extends FieldValues>({
  fields: data,
  schema,
  submitButtonText,
  submitButtonHandler,
  isSubmitting,
}: FormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      className={authFormClass}
      onSubmit={handleSubmit(submitButtonHandler)}
    >
      {data.map(({ schemaKey, ...rest }) => (
        <Input
          key={schemaKey}
          {...rest}
          {...register(schemaKey)}
          error={errors[schemaKey]?.message as string | undefined}
        />
      ))}

      <Button disabled={isSubmitting} type="submit">
        {submitButtonText}
      </Button>
    </form>
  );
}

export default Form;
