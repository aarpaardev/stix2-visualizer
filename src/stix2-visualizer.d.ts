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

interface IRelationLabelOptions {
  labelFont?: string,
  labelFontSize?: number,
  labelBackgroundColor?: string;
  labelColor?: string;
  labelOnHover?: ((link: LinkObject) => string) | string;
  displayLabel: boolean;
}

interface IRelationDirectionOptions { 
  arrowLength?: ((link: LinkObject) => number) | number;
  arrowRelativePositions?: ((link: LinkObject) => number) | number;
  directionalParticles?: ((link: LinkObject) => number) | number;
  directionalParticleSpeed?: ((link: LinkObject) => number) | number;
  directionalParticleWidth?: ((link: LinkObject) => number) | number;
  directionalParticlesColor?: ((link: LinkObject) => string) | string;
  displayDirections: boolean;
}

interface IRelationOptions {
  width?: number;
  curvature?: number;
  color?: string;

}
interface IStix2Visualizer {
  relationOptions?: IRelationOptions;
  directionOptions?: IRelationDirectionOptions;
  relationLabelOptions?: IRelationLabelOptions;
}

export {NodeObject, LinkObject, IRelationOptions, IStix2Visualizer, GraphData}