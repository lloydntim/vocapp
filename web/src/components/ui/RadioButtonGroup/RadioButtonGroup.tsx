import React, { ComponentProps, useState } from 'react';
import RadioButton from '../RadioButton/RadioButton';

const radioButtonGroupClass =
  'inline-flex bg-(--surface-alt)  border-(--border) rounded-[10px] p-[3px]';

interface RadioButtonGroupProps {
  radios: ComponentProps<typeof RadioButton>[];
  changeHandler?: (value: string) => void;
}

function RadioButtonGroup({ radios, changeHandler }: RadioButtonGroupProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    radios[0]?.value as string | null,
  );

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
