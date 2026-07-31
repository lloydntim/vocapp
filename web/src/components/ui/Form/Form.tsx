import {
  BaseSyntheticEvent,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Button from '@/components/ui/Button/Button';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import InputField from '@/components/ui/InputField/InputField';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

import {
  Control,
  FieldPath,
  FieldValues,
  useController,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';
import AutoComplete, { AutoCompleteItem } from '../AutoComplete/AutoComplete';

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
  disabled?: boolean;
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

interface CheckboxFieldProps<
  T extends FieldValues,
  TOutput extends FieldValues = T,
> {
  control: Control<T, unknown, TOutput>;
  name: FieldPath<T>;
  id: string;
  label: string;
  error?: string;
}

function CheckboxField<T extends FieldValues, TOutput extends FieldValues = T>({
  control,
  name,
  ...rest
}: CheckboxFieldProps<T, TOutput>) {
  const { field } = useController({ name, control });

  return (
    <Checkbox
      {...rest}
      name={field.name}
      checked={Boolean(field.value)}
      onBlur={field.onBlur}
      onChange={(event) => field.onChange(event.target.checked)}
    />
  );
}

interface AutoCompleteFieldProps<
  T extends FieldValues,
  TOutput extends FieldValues = T,
> {
  control: Control<T, unknown, TOutput>;
  name: FieldPath<T>;
  id: string;
  label: string;
  placeholder?: string;
  icon?: string;
  dataList: AutoCompleteItem[];
  error?: string;
}

// Selecting a suggestion needs to write a value into the form without a
// native input event, and the text shown ("French") isn't the value that
// gets submitted (a code like "fr") — so this field is controlled via
// useController instead of register(), with the typed search text kept
// separate from the committed form value until a suggestion is picked.
function AutoCompleteField<
  T extends FieldValues,
  TOutput extends FieldValues = T,
>({ control, name, dataList, ...rest }: AutoCompleteFieldProps<T, TOutput>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });
  const [searchText, setSearchText] = useState<string | null>(null);

  const selectedItem = dataList.find((item) => item.value === field.value);
  const displayValue = searchText ?? selectedItem?.text ?? '';

  // react-hooks/refs flags every property read off `field` here because its
  // type includes `ref` — react-hook-form's ControllerRenderProps shape, not
  // an actual ref access. The React Compiler isn't enabled in this project
  // (see next.config.ts), so this is a lint-only false positive.
   
  return (
    <AutoComplete
      {...rest}
      name={field.name}
      dataList={dataList}
      value={displayValue}
      error={error?.message ?? rest.error}
      onBlur={field.onBlur}
      onChange={(event) => setSearchText(event.target.value)}
      onSelect={(item) => {
        field.onChange(item.value);
        setSearchText(item.text);
      }}
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
  dataList?: AutoCompleteItem[];
  showPasswordStrength?: boolean;
  disabled?: boolean;
};

interface FormHelpers<T extends FieldValues> {
  trigger: UseFormTrigger<T>;
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
}

interface FormHandle<T extends FieldValues> extends FormHelpers<T> {
  reset(): void;
}

interface FormProps<T extends FieldValues, TOutput extends FieldValues = T> {
  ref?: Ref<FormHandle<T>>;
  id?: string;
  fields: InputDataItem<T>[];
  schema: ZodType<TOutput, T>;
  values?: T;
  submitButtonText?: string;
  isSubmitButton?: boolean;
  submitButtonHandler: (
    data: TOutput,
    helpers: FormHelpers<T>,
    event?: BaseSyntheticEvent,
  ) => unknown | Promise<unknown>;
  submitButtonClickHandler?: (args: FormHelpers<T>) => void;
  onValuesChange?: (values: Partial<T>) => void;
  isSubmitting?: boolean;
  hideSubmitButton?: boolean;
}

function Form<T extends FieldValues, TOutput extends FieldValues = T>({
  ref,
  id,
  values,
  fields: data,
  schema,
  submitButtonText,
  submitButtonHandler,
  submitButtonClickHandler,
  onValuesChange,
  isSubmitting,
  isSubmitButton = true,
  hideSubmitButton,
}: FormProps<T, TOutput>) {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    subscribe,
    reset,
    formState: { errors },
  } = useForm<T, unknown, TOutput>({
    resolver: zodResolver(schema),
    values,
  });

  useImperativeHandle(
    ref,
    () => ({ reset: () => reset(), trigger, setValue, getValues }),
    [reset, trigger, setValue, getValues],
  );

  useEffect(() => {
    if (!onValuesChange) return;

    return subscribe({
      formState: { values: true },
      callback: ({ values: nextValues }) => onValuesChange(nextValues),
    });
  }, [subscribe, onValuesChange]);

  return (
    <form
      id={id}
      className={authFormClass}
      method="post"
      onSubmit={handleSubmit((data, event) => {
        console.log('form data', data);
        return submitButtonHandler(
          data,
          { trigger, setValue, getValues },
          event,
        );
      })}
    >
      {data.map(({ schemaKey, dataList, ...rest }) =>
        rest.type === 'autocomplete' ? (
          <AutoCompleteField
            key={schemaKey}
            {...rest}
            control={control}
            name={schemaKey}
            dataList={dataList ?? []}
            error={errors[schemaKey]?.message as string | undefined}
          />
        ) : rest.type === 'checkbox' ? (
          <CheckboxField
            key={schemaKey}
            {...rest}
            control={control}
            name={schemaKey}
            error={errors[schemaKey]?.message as string | undefined}
          />
        ) : (
          <Input
            key={schemaKey}
            {...rest}
            {...register(schemaKey)}
            error={errors[schemaKey]?.message as string | undefined}
          />
        ),
      )}

      {!hideSubmitButton && (
        <Button
          onClick={() =>
            submitButtonClickHandler?.({ trigger, setValue, getValues })
          }
          disabled={isSubmitting}
          loading={isSubmitting}
          type={isSubmitButton ? 'submit' : 'button'}
        >
          {submitButtonText}
        </Button>
      )}
    </form>
  );
}

export type { FormProps, FormHandle };
export default Form;
