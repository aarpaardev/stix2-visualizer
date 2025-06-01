import { GraphData, ILabelOptions } from '../stix2-visualizer';
import { Stix2ObjectTypes, StixBundle, StixObject } from './types';

/**
 * Create image element from image files.
 * @param {string} objectType Stix2 object name
 * @returns {HTMLImageElement} HTML Element
 */
const createImage = (objectType: string): HTMLImageElement => {
  const image = new Image();
  // eslint-disable-next-line no-undef
  image.src = require(`../assets/stix2Icons/stix2-${objectType}-icon-tiny-round-v1.png`);
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
    icons[value as Stix2ObjectTypes] = createImage(value);
  }
  return icons;
};

/**
 * Create a curved line
 * @param {string} label label to be displayed
 * @param {CanvasRenderingContext2D} ctx canvas object
 * @param {ILabelOptions} labelOptions label to be displayed on the line
 * @param {number} x starting x-axis and y-axis position
 * @param {number} y ending x-axis and y-axis position
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
    if (labelOptions.backgroundColor) {
      ctx.fillStyle = labelOptions.backgroundColor; // 'rgba(0, 0, 0, 0.6)';
      const padding = 4;
      const textWidth = ctx.measureText(label).width;
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
    ctx.fillText(label, x, y);
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
 * Transform stix data into graph data.
 * @param {Record<string, unknown> | JSON} data Stix2 object name
 * @param {number} nodeWidth Node width
 * @param {boolean} showNodeLabel Whether to show label on node
 * @param {boolean} showLinkLabel Whether to show label on link
 * @param {'round'} iconShape In which shape the icons should be
 * @returns {GraphData} transformed dorce-graph data
 */
export const formatData = (
  data: Record<string, unknown> | JSON,
  nodeWidth: number,
  showNodeLabel = true,
  showLinkLabel = true,
  iconShape: 'round' = 'round'
): GraphData => {
  const graphData: GraphData = { links: [], nodes: [] };
  const stixBundle = data as StixBundle;
  if (stixBundle && stixBundle.objects) {
    const icons = loadIcons(iconShape);
    stixBundle.objects.forEach((object) => {
      if (typeof object.type === 'string') {
        if (object.type === Stix2ObjectTypes.Relationship) {
          /**
           * Make sure the node exists, for which
           * a relation has already been created.
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
            graphData.nodes.push({
              id: object.id,
              name: showNodeLabel ? (object.name ?? object.type) : undefined,
              img: icons[object.type] ?? icons[Stix2ObjectTypes.CustomObject],
              val: nodeWidth,
            });
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
  return graphData;
};
