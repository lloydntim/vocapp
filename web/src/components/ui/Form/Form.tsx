import { Ref } from 'react';
import Button from '@/components/ui/Button/Button';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import InputField from '@/components/ui/InputField/InputField';
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

const authFormClass = 'flex flex-col gap-4';

interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  error?: string;
  icon?: string;
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
    return (
      <Checkbox ref={ref} id={id} label={label} error={error} {...rest} />
    );
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

type InputDataItem = {
  schemaKey: string;
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  icon?: string;
};

interface FormProps {
  fields: InputDataItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any;
  submitButtonText: string;
  submitButtonHandler:
    | SubmitHandler<FieldValues>
    | ((data: FieldValues) => void);
}

function Form({
  fields: data,
  schema,
  submitButtonText,
  submitButtonHandler,
}: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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

      <Button type="submit">{submitButtonText}</Button>
    </form>
  );
}

export default Form;
