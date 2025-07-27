import type { Meta, StoryObj } from '@storybook/react';
import APT1 from '../examples/MandiantAPT1Report.json';
import { Stix2Visualizer } from '../components';

const meta = {
  title: 'Props/Default Visualization',
  component: Stix2Visualizer,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Stix2Visualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultProperties: Story = {
  args: {
    data: APT1,
  },
};

DefaultProperties.storyName = 'Default properties';
