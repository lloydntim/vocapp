import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComponentProps, useState } from 'react';

import AutoComplete, { AutoCompleteItem } from './AutoComplete';

const languageOptions: AutoCompleteItem[] = [
  { value: 'fr', text: 'French' },
  { value: 'es', text: 'Spanish' },
  { value: 'de', text: 'German' },
  { value: 'it', text: 'Italian' },
  { value: 'pt', text: 'Portuguese' },
  { value: 'ja', text: 'Japanese' },
];

function AutoCompletePreview(args: ComponentProps<typeof AutoComplete>) {
  const [value, setValue] = useState(args.value);

  return (
    <AutoComplete
      {...args}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onSelect={(item) => setValue(item.text)}
    />
  );
}

const meta = {
  component: AutoComplete,
  args: {
    id: 'language',
    label: 'Language',
    placeholder: 'Search languages',
    value: '',
    dataList: languageOptions,
    onChange: () => {},
    onSelect: () => {},
  },
  argTypes: {
    icon: {
      options: [undefined, 'search', 'language'],
      control: { type: 'select' },
    },
  },
  render: (args) => <AutoCompletePreview {...args} />,
} satisfies Meta<typeof AutoComplete>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic = {} satisfies Story;

export const WithIcon = {
  args: {
    icon: 'search',
  },
} satisfies Story;

export const Prefilled = {
  args: {
    value: 'Fr',
  },
} satisfies Story;

export const WithHint = {
  args: {
    hint: 'Start typing to search supported languages.',
  },
} satisfies Story;

export const WithError = {
  args: {
    error: 'Select a language from the list.',
  },
} satisfies Story;
