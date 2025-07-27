import type { Meta, StoryObj } from '@storybook/react';
import APT1 from '../examples/MandiantAPT1Report.json';
import { Stix2Visualizer } from '../components';
import { NodeObject, LinkObject, ReactForceRef } from '../stix2-visualizer';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Props/Link Interaction',
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

export const LinkCustomizationOnHover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Change properties of hovered link.',
      },
    },
  },
  args: {
    data: APT1,
    directionOptions: {
      onHoverParticlesSize: 6,
    },
    linkOptions: {
      /**
       * @param {LinkObject} link link Object
       * @param {CanvasRenderingContext2D} ctx node canvas context
       */
      onHover: (link: LinkObject, ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = 'rgba(166, 0, 255, 0.6)';
        ctx.lineWidth = 15;
        ctx.stroke();
      },
    },
  },
};

LinkCustomizationOnHover.storyName = 'Customizing link on hover';

export const NodeCustomizationOnHover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Change properties of connected links on node hover.',
      },
    },
  },
  args: {
    data: APT1,
    linkOptions: {
      /**
       * @param {LinkObject} link link Object
       * @param {CanvasRenderingContext2D} ctx node canvas context
       */
      onHover: (link: LinkObject, ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = 'rgba(36, 35, 35, 0.6)';
        ctx.stroke();

        /**
         *
         * @param {CanvasRenderingContext2D} neighCtx node canvas context
         * @param {number} x starting x-axis position of node
         * @param {number} y starting y-axis position of node
         */
        const drawHighlightFunc = (
          neighCtx: CanvasRenderingContext2D,
          x: number,
          y: number
        ): void => {
          neighCtx.beginPath();
          neighCtx.arc(x, y, 25, 0, Math.PI * 2); // full circle
          neighCtx.fillStyle = 'rgba(128, 15, 15, 0.5)';
          neighCtx.fill();
          neighCtx.stroke();
        };
        if (link.source) {
          (link.source as NodeObject).drawHighlight = drawHighlightFunc;
        }
        if (link.target) {
          (link.target as NodeObject).drawHighlight = drawHighlightFunc;
        }
      },
    },
  },
};

NodeCustomizationOnHover.storyName = 'Customizing connected nodes on link hover';

export const LinkOnClickEvent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Change properties of connected links on node hover.',
      },
    },
  },
  args: {
    data: APT1,
    linkOptions: {
      /**
       * @param {LinkObject} link Link object
       * @param {ReactForceRef} _ref React force Reference
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      onClick: (link: LinkObject, _ref: ReactForceRef | undefined): void => {
        action('Link clicked')({
          label: link.label,
          source: link.source,
          target: link.target,
        });
      },
    },
  },
};

LinkOnClickEvent.storyName = 'Display action data on click';
