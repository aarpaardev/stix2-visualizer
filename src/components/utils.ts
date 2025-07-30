import type {
  GraphData,
  ILabelOptions,
  LinkObject,
  NodeObject,
  StixBundle,
  StixObject,
  ILegend,
  FormattedData,
} from '../types';
import { Stix2ObjectTypes } from './types';
import Icons from './icons';

/**
 * Create image element from image files.
 * @param {string} objectType Stix2 object name
 * @param {string} variant icon variant such as round, square
 * @returns {HTMLImageElement} HTML Element
 */
const createImage = (objectType: string, variant: 'round'): HTMLImageElement => {
  const image = new Image();
  // eslint-disable-next-line no-undef

  image.src = Icons[variant][objectType];
  return image;
};

/**
 * Load icons for stix2 objects
 * @param {string} variant icon variant such as round, square
 * @returns {Partial<Record<Stix2ObjectTypes, HTMLImageElement>>} icon records
 */
export const loadIcons = (
  variant: 'round'
): Partial<Record<Stix2ObjectTypes, HTMLImageElement>> => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const notUsed = variant;
  const icons: Partial<Record<Stix2ObjectTypes, HTMLImageElement>> = {};
  for (const value of Object.values(Stix2ObjectTypes)) {
    icons[value as Stix2ObjectTypes] = createImage(value, variant);
  }
  return icons;
};

/**
 * Truncates label according to mprovided axLength
 * @param {string} input input string / label
 * @param {number} maxLength Maximum characters of string
 * @returns {string} truncated label
 */
export const truncateLabel = (input: string, maxLength = 50): string => {
  if (input.length <= maxLength) {
    return input;
  }
  return `${input.slice(0, maxLength - 3)}...`;
};

/**
 * Create a curved line
 * @param {string} label label to be displayed
 * @param {CanvasRenderingContext2D} ctx canvas object
 * @param {ILabelOptions} labelOptions label to be displayed on the line
 * @param {number} x starting x-axis position
 * @param {number} y ending x-axis position
 * @returns {void}
 */
export function createLabel(
  label: string,
  ctx: CanvasRenderingContext2D,
  labelOptions: ILabelOptions,
  x: number,
  y: number
): void {
  if (labelOptions.display) {
    const fontSzie = labelOptions.fontSize || 0;
    const font = labelOptions.font || 'sans-serif';
    const color = labelOptions.color || 'rgba(0, 0, 0, 0)';
    /**
     * Optional: background box for text
     */
    const tuncatedLabel = truncateLabel(label);
    if (labelOptions.backgroundColor) {
      ctx.fillStyle = labelOptions.backgroundColor;
      const padding = 4;
      const textWidth = ctx.measureText(tuncatedLabel).width;
      ctx.fillRect(
        x - textWidth / 2 - padding,
        y - fontSzie,
        textWidth + padding * 2,
        fontSzie + padding
      );
    }

    ctx.fillStyle = color;
    ctx.font = `${fontSzie}px ${font || 'sans-serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tuncatedLabel, x, y);
  }
}

/**
 * Check if stix object exists
 * @param {string} objectId id of object to find
 * @param {Array<StixObject>} objects stix object lists
 * @returns {boolean} whether object exists or not
 */
export const objectExists = (objectId: string, objects: Array<StixObject>): boolean => {
  return objects.some((object) => {
    return object.id === objectId;
  });
};

/**
 * Cross reference nodes and links
 * @param {LinkObject} link link object
 * @param {Array<NodeObject>} nodes node objects
 * @returns {void}
 */
export const crossLink = (link: LinkObject, nodes: Record<string, NodeObject>): void => {
  if (link.source && link.target) {
    const a = nodes[link.source as string];
    const b = nodes[link.target as string];
    // eslint-disable-next-line no-unused-expressions
    !a.neighbors && (a.neighbors = []);
    // eslint-disable-next-line no-unused-expressions
    !b.neighbors && (b.neighbors = []);
    a.neighbors.push(b);
    b.neighbors.push(a);

    // eslint-disable-next-line no-unused-expressions
    !a.links && (a.links = []);
    // eslint-disable-next-line no-unused-expressions
    !b.links && (b.links = []);
    a.links.push(link);
    b.links.push(link);
  }
};

/**
 * Transform labels to human readable form
 * @param {string} input input string / label
 * @returns {string} transformed label
 */
export const formatLegendLabel = (input: string): string => {
  return input
    .split('-')
    .map((word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

/**
 * Transform stix data into graph data.
 * @param {Record<string, unknown> | JSON} data Stix2 object name
 * @param {number} nodeWidth Node width
 * @param {boolean} showNodeLabel Whether to show label on node
 * @param {boolean} showLinkLabel Whether to show label on link
 * @param {'round'} iconShape In which shape the icons should be
 * @returns {GraphData} transformed dorce-graph data
 */
export const formatData = (
  data: Record<string, unknown> | object | StixBundle,
  nodeWidth: number,
  showNodeLabel = true,
  showLinkLabel = true,
  iconShape: 'round' = 'round'
): FormattedData => {
  const graphData: GraphData = { links: [], nodes: [] };
  const nodes: Record<string, NodeObject> = {};
  const legends: Array<ILegend> = [];
  const legendSet = new Set<string>();
  const stixBundle = data as StixBundle;
  if (stixBundle && stixBundle.objects) {
    const icons = loadIcons(iconShape);
    stixBundle.objects.forEach((object) => {
      if (typeof object.type === 'string') {
        if (object.type === Stix2ObjectTypes.Relationship) {
          /**
           * Make sure the node exists, for which
           * a link has already been created.
           */
          if (
            object.source_ref &&
            object.target_ref &&
            objectExists(object.source_ref, stixBundle.objects) &&
            objectExists(object.target_ref, stixBundle.objects)
          ) {
            graphData.links.push({
              source: object.source_ref,
              target: object.target_ref,
              label:
                showLinkLabel && object.relationship_type ? object.relationship_type : undefined,
            });
          }
        } else {
          if (object.id) {
            nodes[object.id] = {
              id: object.id,
              name: showNodeLabel ? (object.name ?? object.type) : undefined,
              img: icons[object.type] ?? icons[Stix2ObjectTypes.CustomObject],
              val: nodeWidth,
            };
            if (!legendSet.has(object.type)) {
              legendSet.add(object.type);
              legends.push({
                type: object.type,
                icon: nodes[object.id].img,
              });
            }
          }
          /**
           * Also add marking definition as relation.
           */
          if (
            object.object_marking_refs &&
            Array.isArray(object.object_marking_refs) &&
            object.object_marking_refs.length > 0
          ) {
            object.object_marking_refs.forEach((ref) => {
              if (objectExists(ref, stixBundle.objects)) {
                graphData.links.push({
                  source: ref,
                  target: object.id,
                  label: showLinkLabel ? 'applies-to' : undefined,
                });
              }
            });
          }
        }
      }
    });
  }
  graphData.links.forEach((link) => {
    crossLink(link, nodes);
  });
  graphData.nodes = Object.values(nodes);
  return {
    data: graphData,
    legends: legends,
  };
};
