import { Stix2Objects, IRelationLabelOptions } from './types'

/**
 * Load icons for stix2 objects
 * @param {round} variant icon variant such as round, square
 * @returns {Partial<Record<Stix2Objects, HTMLImageElement>>}
 */
export const loadIcons = (variant: 'round'): Partial<Record<Stix2Objects, HTMLImageElement>> => {
  const icons: Partial<Record<Stix2Objects, HTMLImageElement>>= {}
  for (const [key, value] of Object.entries(Stix2Objects)) {
    icons[key as Stix2Objects] = createImage(value);
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
  image.src = require(`../assets/stix2Icons/stix2_${objectType}_icon_tiny_round_v1.png`);
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

