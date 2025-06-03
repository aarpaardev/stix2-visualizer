import type { Meta, StoryObj } from '@storybook/react';
import APT1 from '../examples/apt1.json';
import { DefaultStixVisualizer } from './DefaultVisualizer';

const meta = {
  title: 'Example/Default Stix2 Visualization',
  component: DefaultStixVisualizer,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DefaultStixVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultStix: Story = {
  args: {
    data: APT1,
  },
};
