import type { Meta, StoryObj } from '@storybook/react';
import APT1 from '../examples/MandiantAPT1Report.json';
import { Stix2Visualizer } from '../components';
import { NodeObject, LinkObject, ReactForceRef } from '../stix2-visualizer';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Props/Node Interaction',
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

export const NeighborCustomizationOnHover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Change properties of neighboring nodes, such as color, size, etc., on hover.',
      },
    },
  },
  args: {
    data: APT1,
    nodeOptions: {
      /**
       * @param {NodeObject} node Node Object
       * @param {CanvasRenderingContext2D} ctx node canvas context
       * @param {Set<NodeObject>} neighbors node canvas context
       */
      onHover: (node: NodeObject, ctx: CanvasRenderingContext2D, neighbors: Set<NodeObject>) => {
        Array.from(neighbors.values()).forEach((neighbor: NodeObject) => {
          /**
           *
           * @param {CanvasRenderingContext2D} neighCtx node canvas context
           * @param {number} x starting x-axis position of node
           * @param {number} y starting y-axis position of node
           */
          neighbor.drawHighlight = (
            neighCtx: CanvasRenderingContext2D,
            x: number,
            y: number
          ): void => {
            neighCtx.beginPath();
            neighCtx.arc(x, y, 10, 0, Math.PI * 2); // full circle
            neighCtx.fillStyle = 'rgba(82, 178, 48, 0.5)';
            neighCtx.fill();
            neighCtx.stroke();
          };
        });
        if (node.img && node.x && node.y) {
          ctx.drawImage(node.img, node.x - 20 / 2, node.y - 20 / 2, 20, 20);
        }
      },
    },
  },
};

NeighborCustomizationOnHover.storyName = 'Customizing neighboring nodes on hover';

export const NodeCustomizationOnHover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Change properties of hovered node.',
      },
    },
  },
  args: {
    data: APT1,
    nodeOptions: {
      /**
       * @param {NodeObject} node Node Object
       * @param {CanvasRenderingContext2D} ctx node canvas context
       * @param {Set<NodeObject>} neighbors node canvas context
       */
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      onHover: (node: NodeObject, ctx: CanvasRenderingContext2D, neighbors: Set<NodeObject>) => {
        if (node.img && node.x && node.y) {
          // ctx.drawImage(node.img, node.x - 20 / 2, node.y - 20 / 2, 20, 20);
          ctx.beginPath();
          ctx.arc(node.x, node.y, 10, 0, Math.PI * 2); // full circle
          ctx.fillStyle = 'rgba(82, 178, 48, 1)';
          ctx.fill();
          ctx.stroke();
        }
      },
    },
  },
};

NodeCustomizationOnHover.storyName = 'Customizing node on hover';

export const LinkCustomizationOnHover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Change properties of connected links on node hover.',
      },
    },
  },
  args: {
    data: APT1,
    nodeOptions: {
      /**
       * @param {NodeObject} node Node Object
       * @param {CanvasRenderingContext2D} ctx node canvas context
       * @param {Set<NodeObject>} neighbors node canvas context
       */
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      onHover: (node: NodeObject, ctx: CanvasRenderingContext2D, neighbors: Set<NodeObject>) => {
        Array.from(neighbors.values()).forEach((neighbor: NodeObject) => {
          /**
           *
           * @param {CanvasRenderingContext2D} neighCtx node canvas context
           * @param {number} x starting x-axis position of node
           * @param {number} y starting y-axis position of node
           */
          neighbor.drawHighlight = (
            neighCtx: CanvasRenderingContext2D,
            x: number,
            y: number
          ): void => {
            neighCtx.beginPath();
            neighCtx.arc(x, y, 10, 0, Math.PI * 2); // full circle
            neighCtx.fillStyle = 'rgba(182, 181, 181, 0.5)';
            neighCtx.fill();
            neighCtx.stroke();
          };
        });
        node.links?.forEach((link: LinkObject) => {
          /**
           *
           * @param {CanvasRenderingContext2D} linkCtx link canvas context
           */
          link.drawHighlight = (linkCtx: CanvasRenderingContext2D): void => {
            linkCtx.strokeStyle = 'rgba(242, 11, 11, 0.6)';
            linkCtx.stroke();
          };
          link.particleWidth = 4;
        });
        if (node.img && node.x && node.y) {
          ctx.drawImage(node.img, node.x - 20 / 2, node.y - 20 / 2, 20, 20);
        }
      },
    },
  },
};

LinkCustomizationOnHover.storyName = 'Customizing links on node hover';

export const NodeOnClickEvent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Change properties of connected links on node hover.',
      },
    },
  },
  args: {
    data: APT1,
    nodeOptions: {
      /**
       * @param {NodeObject} node Node object
       * @param {ReactForceRef} _ref React force Reference
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      onClick: (node: NodeObject, _ref: ReactForceRef | undefined): void => {
        action('Node clicked')({
          name: node.name,
          id: node.id,
        });
      },
    },
  },
};

NodeOnClickEvent.storyName = 'Display action data on click';
