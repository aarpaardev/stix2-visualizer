import { GraphData } from '../stix2-visualizer';
import { Stix2ObjectTypes, IRelationLabelOptions, StixBundle, StixObject } from './types'

/**
 * Load icons for stix2 objects
 * @param {round} variant icon variant such as round, square
 * @returns {Partial<Record<Stix2ObjectTypes, HTMLImageElement>>}
 */
export const loadIcons = (variant: 'round'): Partial<Record<Stix2ObjectTypes, HTMLImageElement>> => {
  const icons: Partial<Record<Stix2ObjectTypes, HTMLImageElement>>= {}
  for (const value of Object.values(Stix2ObjectTypes)) {
    icons[value as Stix2ObjectTypes] = createImage(value);
  }
  return icons
}

/**
 * Create image element from image files.
 * @param {string} objectType Stix2 object name
 * @returns {HTMLImageElement}
 */
const createImage = (objectType:string): HTMLImageElement => {
  const image = new Image();
  image.src = require(`../assets/stix2Icons/stix2-${objectType}-icon-tiny-round-v1.png`);
  return image
}

/**
 * Create a curved line
 * @param {CanvasRenderingContext2D} ctx canvas object
 * @param {{ x: number; y: number }} from starting x-axis and y-axis position
 * @param {{ x: number; y: number }} to ending x-axis and y-axis position
 * @param {number} curvature curvature of the line
 * @param {string} color background color of the line
 * @param {number} width width of the line
 * @param {IRelationLabelOptions | undefined} labelOptions label to be displayed on the line
 * @returns {{ x: number; y: number }} from
 */
export function drawCurvedLine(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  curvature: number,
  color: string,
  width: number,
  labelOptions?: IRelationLabelOptions,
) {
  // Midpoint
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;

  // Vector from start to end
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Rotate 90 degrees and apply curvature
  const cx = mx + curvature * dy;
  const cy = my - curvature * dx;
  // // Perpendicular vector (normalized)
  // const nx = -dy;
  // const ny = dx;
  // const len = Math.sqrt(nx * nx + ny * ny);
  // const ux = nx / len;
  // const uy = ny / len;

  // // Control point (curved away from line)
  // const cx = mx + ux * curvature * len;
  // const cy = my + uy * curvature * len;

  // Draw the curve
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.quadraticCurveTo(cx, cy, to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  if (labelOptions) {
    // Compute midpoint of curve using quadratic Bézier formula at t=0.5
    const t = 0.5;
    const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * cx + t ** 2 * to.x;
    const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * cy + t ** 2 * to.y;

    // Optional: background box for text
    if(labelOptions.backgroundColor){
      ctx.fillStyle = labelOptions.backgroundColor; //'rgba(0, 0, 0, 0.6)';
      const padding = 4;
      const textWidth = ctx.measureText(labelOptions.label).width;
      ctx.fillRect(
        x - textWidth / 2 - padding,
        y - labelOptions.fontSize,
        textWidth + padding * 2,
        labelOptions.fontSize + padding
      );
    }

    // Draw text
    if(labelOptions.color){
      ctx.fillStyle = labelOptions.color;
    } // 'white';

    ctx.font = `${labelOptions.fontSize}px ${labelOptions.font || 'sans-serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelOptions.label, x, y);
  }
}

  /**
 * Check if stix object exists
 * @param {string} objectId id of object to find
 * @param {Arra<StixObject>} objects stix object lists
 * @returns {boolean}
 */
export const objectExists = (objectId: string, objects: Array<StixObject>): boolean => {
  return objects.some(object => object.id === objectId);
}

  /**
 * Transform stix data into graph data.
 * @param {Record<string, unknown> | JSON} data Stix2 object name
 * @param {number} nodeWidth Node width
 * @param {boolean} showNodeLabel Whether to show label on node
 * @param {boolean} showLinkLabel Whether to show label on link
 * @param {'round'} iconShape In which shape the icons should be
 * @returns {GraphData}
 */
export const formatData = (
  data: Record<string, unknown> | JSON,
  nodeWidth: number,
  showNodeLabel = true,
  showLinkLabel = true,
  iconShape: 'round' = 'round',
): GraphData => {
  const graphData: GraphData = {links:[], nodes:[]};
  const stixBundle = data as StixBundle;
  if(stixBundle && stixBundle.objects){
    
    const icons = loadIcons(iconShape);
    stixBundle.objects.forEach(object => {
      if(typeof object.type === 'string'){
        if(object.type === Stix2ObjectTypes.Relationship){
          /**
           * Make sure the node exists, for which
           * a relation has already been created.
           */
          if(
            object.source_ref &&
            object.target_ref &&
            objectExists(object.source_ref, stixBundle.objects) &&
            objectExists(object.target_ref, stixBundle.objects)
            ){  
            graphData.links.push(
              {
                source: object.source_ref,
                target: object.target_ref,
                label: showLinkLabel && object.relationship_type ? object.relationship_type : undefined,
              }
            );
          }
        }
        else{
          if(object.id){
            graphData.nodes.push(
              {
                id: object.id,
                name: showNodeLabel ? object.name ?? object.type : undefined,
                img: icons[object.type] ?? icons[Stix2ObjectTypes.CustomObject],
                val: nodeWidth,
              }
            );
          }
          /**
           * Also add marking definition as relation.
           */
          if(
            object.object_marking_refs &&
            Array.isArray(object.object_marking_refs) &&
            object.object_marking_refs.length > 0
          ){
            object.object_marking_refs.forEach((ref) => {
              if(objectExists(ref, stixBundle.objects)){
                graphData.links.push(
                  {
                    source: ref,
                    target: object.id,
                    label: showLinkLabel ? 'applies-to' : undefined,
                  }
                )
              }
            })
          }
        }
    }
    })
  }
  console.log(graphData);
  console.log('aaya')
  return graphData
}
