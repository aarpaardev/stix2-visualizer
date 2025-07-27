import type { Meta, StoryObj } from '@storybook/react';
import APT1Report from '../examples/MandiantAPT1Report.json';
import PoisonIvyReport from '../examples/FireeyePoisonIvyReport.json';
import IMDDOSBotnetReport from '../examples/IMDDOSBotnetReport.json';
import { Stix2Visualizer } from '../components';

const meta = {
  title: 'Examples/Stix2 Json Samples',
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

export const APT1: Story = {
  args: {
    data: APT1Report,
  },
};

APT1.storyName = 'Mandiant APT1 Report';

export const PoisonIvy: Story = {
  args: {
    data: PoisonIvyReport,
  },
};

PoisonIvy.storyName = 'Fire eye PoisonIvy Report';

export const IMDDOSBotnet: Story = {
  args: {
    data: IMDDOSBotnetReport,
  },
};

IMDDOSBotnet.storyName = 'IMDDOS Botnet Report';
