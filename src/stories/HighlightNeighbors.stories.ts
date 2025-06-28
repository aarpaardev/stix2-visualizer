import type { Meta, StoryObj } from '@storybook/react';
import APT1 from '../examples/apt1.json';
import { Stix2HighlightNeighbors } from './HighlightNeighbors';

const meta = {
  title: 'Props/Node Interaction',
  component: Stix2HighlightNeighbors,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Stix2HighlightNeighbors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultProperties: Story = {
  args: {
    data: APT1,
  },
};

DefaultProperties.storyName = '🟢 Default properties';
