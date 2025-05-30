type NodeObject<NodeType = {}> = NodeType & {
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
  [others: string]: any;
};

type LinkObject<NodeType = {}, LinkType = {}> = LinkType & {
  source?: string | number | NodeObject<NodeType>;
  target?: string | number | NodeObject<NodeType>;
  color?: string;
  // width?: number;
  [others: string]: any;
};

interface GraphData<NodeType = {}, LinkType = {}> {
  nodes: NodeObject<NodeType>[];
  links: LinkObject<NodeType, LinkType>[];
}

interface ILabelOptions {
  font?: string,
  fontSize?: number,
  label?: string,
  backgroundColor?: string;
  color?: string;
  display?: boolean;
}

interface ILinkDirectionOptions { 
  arrowLength?: ((link: LinkObject) => number) | number;
  arrowRelativePositions?: ((link: LinkObject) => number) | number;
  directionalParticles?: ((link: LinkObject) => number) | number;
  directionalParticleSpeed?: ((link: LinkObject) => number) | number;
  directionalParticleWidth?: ((link: LinkObject) => number) | number;
  directionalParticlesAndArrowColor?: ((link: LinkObject) => string) | string;
  displayDirections: boolean;
}

interface ILinkOptions {
  width?: ((link: LinkObject) => number) | number;
  curvature?: number;
  distance?: number;
  color?: string;
  disableDefaultHoverBehavior?: boolean;
  onHover?: ((link: LinkObject | null) => void);
}

interface INodeOptions {
  disableDefaultHoverBehavior?: boolean;
  onHover?: ((link: NodeObject | null) => void);
}

interface IStix2Visualizer {
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
  ILabelOptions
}