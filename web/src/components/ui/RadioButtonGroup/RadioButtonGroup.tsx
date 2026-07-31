import React, { ComponentProps, useEffect, useState } from 'react';
import RadioButton from '../RadioButton/RadioButton';

const radioButtonGroupClass =
  'inline-flex bg-(--surface-alt)  border-(--border) rounded-[10px] p-[3px]';

interface RadioButtonGroupProps {
  radios: ComponentProps<typeof RadioButton>[];
  value?: string;
  changeHandler?: (value: string) => void;
}

function RadioButtonGroup({ radios, value, changeHandler }: RadioButtonGroupProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    value ?? (radios[0]?.value as string | null),
  );

  useEffect(() => {
    if (value !== undefined) setSelectedValue(value);
  }, [value]);

  return (
    <div role="radiogroup" className={radioButtonGroupClass}>
      {radios.map((radio, index) => (
        <RadioButton
          key={index}
          {...radio}
          checked={radio.value === selectedValue}
          onChange={() => {
            setSelectedValue(radio.value as string);
            changeHandler?.(radio.value as string);
          }}
        />
      ))}
    </div>
  );
}

export default RadioButtonGroup;
