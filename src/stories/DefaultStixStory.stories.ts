import type { Meta, StoryObj } from '@storybook/react';
import { Stix2Visualizer } from '../components/index';
import APT1 from '../examples/apt1.json';

const meta = {
  title: 'Example/Requirements',
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

export const DefaultStix: Story = {
  args: {
    data: APT1
    // relationOptions: {
    //   distance: 120
    // }
  }
};
