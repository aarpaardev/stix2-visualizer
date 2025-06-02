import { StixBundle } from './components/types';

type NodeObject<NodeType = object> = NodeType & {
  id: string | number;
  img?: HTMLImageElement;
  name?: string;
  val?: number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number;
  fy?: number;
  fz?: number;
  neighbors?: Array<NodeObject>;
  // eslint-disable-next-line no-use-before-define
  links?: Array<LinkObject>;
  [others: string]: unknown;
};

type LinkObject<NodeType = object, LinkType = object> = LinkType & {
  source?: string | number | NodeObject<NodeType>;
  target?: string | number | NodeObject<NodeType>;
  color?: string;
  // width?: number;
  [others: string]: unknown;
};

interface GraphData<NodeType = object, LinkType = object> {
  nodes: NodeObject<NodeType>[];
  links: LinkObject<NodeType, LinkType>[];
}

interface ILabelOptions {
  font?: string;
  fontSize?: number;
  backgroundColor?: string;
  color?: string;
  display?: boolean;
  onZoomOutDisplay?: boolean;
}

interface ILinkDirectionOptions {
  directionSize?: ((link: LinkObject) => number) | number;
  arrowRelativePositions?: ((link: LinkObject) => number) | number;
  directionalParticles?: ((link: LinkObject) => number) | number;
  directionalParticleSpeed?: ((link: LinkObject) => number) | number;
  directionalParticleSize?: ((link: LinkObject) => number) | number;
  directionalParticlesAndArrowColor?: ((link: LinkObject) => string) | string;
  onHoverParticlesSize?: number;
  onHoverArrowSize?: number;
  displayDirections?: boolean;
  displayParticles?: boolean;
}

interface ILinkOptions {
  width?: ((link: LinkObject) => number) | number;
  curvature?: number;
  distance?: number;
  color?: string;
  disableZoomOnClick?: boolean;
  onHover?: (link: LinkObject, ctx: CanvasRenderingContext2D) => void;
  onClick?: (link: LinkObject) => void;
}

interface INodeOptions {
  size?: number;
  disableZoomOnClick?: boolean;
  onHover?: (node: NodeObject, ctx: CanvasRenderingContext2D) => void;
  onClick?: (node: NodeObject) => void;
}

interface IStix2Visualizer {
  data: JSON | StixBundle;
  nodeOptions?: INodeOptions;
  relationOptions?: ILinkOptions;
  directionOptions?: ILinkDirectionOptions;
  relationLabelOptions?: ILabelOptions;
  nodeLabelOptions?: ILabelOptions;
}

export { NodeObject, LinkObject, ILinkOptions, IStix2Visualizer, GraphData, ILabelOptions };
