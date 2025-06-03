import { ForceGraphInstance } from 'force-graph';
import { StixBundle, StixObject, Stix2ObjectTypes } from './components/types';

type Coordinates = { x: number; y: number };
type ZoomTransformation = { k: number; x: number; y: number };

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

interface ForceFn<NodeType = object> {
  (alpha: number): void;
  initialize?: (nodes: NodeObject<NodeType>[], ...args: unknown[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ForceGraphMethods<NodeType = object, LinkType = object> {
  // Link styling
  emitParticle(link: LinkObject<NodeType, LinkType>): ForceGraphInstance;

  // Force engine (d3-force) configuration
  d3Force(
    forceName: 'link' | 'charge' | 'center' | string
  ): ForceFn<NodeObject<NodeType>> | undefined;
  d3Force(
    forceName: 'link' | 'charge' | 'center' | string,
    forceFn: ForceFn<NodeObject<NodeType>> | null
  ): ForceGraphInstance;
  d3ReheatSimulation(): ForceGraphInstance;

  // Render control
  pauseAnimation(): ForceGraphInstance;
  resumeAnimation(): ForceGraphInstance;
  centerAt(): { x: number; y: number };
  centerAt(x?: number, y?: number, durationMs?: number): ForceGraphInstance;
  zoom(): number;
  zoom(scale: number, durationMs?: number): ForceGraphInstance;
  zoomToFit(
    durationMs?: number,
    padding?: number,
    nodeFilter?: (node: NodeObject<NodeType>) => boolean
  ): ForceGraphInstance;

  // Utility
  getGraphBbox(nodeFilter?: (node: NodeObject<NodeType>) => boolean): {
    x: [number, number];
    y: [number, number];
  };
  screen2GraphCoords(x: number, y: number): { x: number; y: number };
  graph2ScreenCoords(x: number, y: number): { x: number; y: number };

  cameraPosition: (
    position: { x: number; y: number; z: number },
    lookAt?: NodeObject,
    durationMs?: number
  ) => { x: number; y: number; z: number };
}

type ReactForceRef = ForceGraphMethods<NodeObject<object>, LinkObject<object, object> | undefined>;

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
  onClick?: (link: LinkObject, ref?: ReactForceRef) => void;
}

interface INodeOptions {
  size?: number;
  disableZoomOnClick?: boolean;
  onHover?: (node: NodeObject, ctx: CanvasRenderingContext2D) => void;
  onClick?: (node: NodeObject, ref?: ReactForceRef) => void;
}

interface IStix2Visualizer {
  data: StixBundle | object;
  nodeOptions?: INodeOptions;
  relationOptions?: ILinkOptions;
  directionOptions?: ILinkDirectionOptions;
  relationLabelOptions?: ILabelOptions;
  nodeLabelOptions?: ILabelOptions;
}

export {
  NodeObject,
  LinkObject,
  ILinkOptions,
  IStix2Visualizer,
  GraphData,
  ILabelOptions,
  StixBundle,
  StixObject,
  Stix2ObjectTypes,
  Coordinates,
  ForceGraphMethods,
  ReactForceRef,
  ZoomTransformation,
};
