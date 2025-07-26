# 📦 STIX Visualizer

**STIX Visualizer** is a customizable and interactive React component to visualize [STIX 2.0](https://oasis-open.github.io/cti-documentation/stix/intro) bundles using canvas and force-directed graphs. It supports nodes, links, labels, legends, directional particles, and full styling and behavior overrides.

<p align="center">
  <img width="1880" height="766" alt="STIX Visualizer Preview" src="https://github.com/user-attachments/assets/04409ada-94ab-4239-a3c7-525bfc0d710b" />
</p>

---

## 🚀 Features

- Visualizes STIX 2.x bundles
- Canvas-based performance with directional links and animations
- Fully customizable via props
- Optional legends with configurable positions
- Zoom/hover/click event hooks
- Storybook integration for isolated component previews

---

## 📦 Installation

```bash
npm install stix-visualizer
# or
yarn add stix-visualizer
```

## 🔰 Usage

```tsx
import { Stix2Visualizer } from 'stix-visualizer';
import exampleData from './stix-bundle.json';

export default function App() {
  return (
    <div style={{ height: '100vh' }}>
      <Stix2Visualizer data={exampleData} />
    </div>
  );
}
```

## 🧩 Props

### `Stix2VisualizerProps`

| Prop               | Type                   | Required | Description |
|--------------------|------------------------|----------|-------------|
| `data`             | `StixBundle \| object` | ✅      | A valid [STIX 2.x Bundle JSON object](https://oasis-open.github.io/cti-documentation/stix/intro) that defines the entities and relationships to be visualized. Refer to [this sample STIX bundle](https://oasis-open.github.io/cti-documentation/examples/example_json/apt1.json) for reference. |
| `nodeOptions`      | `INodeOptions`         | ❌      | Configuration for visual node appearance (e.g., color, radius, interactivity). See table below. |
| `linkOptions`      | `ILinkOptions`         | ❌      | Configuration for link appearance and behavior. See table below. |
| `legendOptions`    | `ILegendOptions`       | ❌      | Options for showing and positioning the legend. See table below. |
| `directionOptions` | `ILinkDirectionOptions`| ❌      | Defines directional indicators on links like arrows and particles. See table below. |
| `linkLabelOptions` | `ILabelOptions`        | ❌      | Options for displaying text labels on links. See table below. |
| `nodeLabelOptions` | `ILabelOptions`        | ❌      | Options for displaying text labels on nodes. See table below. |

#### `nodeOptions` Props

| Property             | Type                             | Default       | Description                                                                  |
| -------------------- | -------------------------------- | ------------- | ---------------------------------------------------------------------------- |
| `size`               | `number`                         | `12`          | Node size in pixels.                                                         |
| `disableZoomOnClick` | `boolean`                        | `false`       | Disables zoom behavior on node click.                                        |
| `onHover`            | `(node, ctx, neighbors) => void` | *(See below)* | Callback for when a node is hovered. Highlights neighboring nodes.           |
| `onClick`            | `(node, ref?) => void`           | `undefined`   | Callback for when a node is clicked. You can access the graph ref if needed. |


###### Default `onHover`

```ts
/**
 * @param {NodeObject} node Node Object
 * @param {CanvasRenderingContext2D} ctx node canvas context
 * @param {Set<NodeObject>} neighbors node canvas context
 */
(node: NodeObject, ctx: CanvasRenderingContext2D, neighbors: Set<NodeObject>) => {
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
  if (node.img && node.x && node.y) {
    ctx.drawImage(node.img, node.x - 20 / 2, node.y - 20 / 2, 20, 20);
  }
}
```

#### `linkOptions` Props

| Prop                 | Type                                                        | Default                           | Description                                                       |
| -------------------- | ----------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------- |
| `width`              | `number` \| `(link: LinkObject) => number`                  | `1`                               | Width of the link line or a function to calculate it dynamically. |
| `curvature`          | `number`                                                    | `0.25`                            | Controls how curved the link lines are.                           |
| `distance`           | `number`                                                    | `60`                              | Distance between connected nodes.                                 |
| `color`              | `string`                                                    | `'rgba(126,126,126, 0.6)'`        | Stroke color of the link.                                         |
| `disableZoomOnClick` | `boolean`                                                   | `false`                           | Prevents zoom on link click if set to `true`.                     |
| `onHover`            | `(link: LinkObject, ctx: CanvasRenderingContext2D) => void` | *(See below)*                     | Callback invoked when hovering over a link.                       |
| `onClick`            | `(link: LinkObject, ref?: ReactForceRef) => void`           | `undefined`                       | Callback invoked when clicking a link.                            |



###### Default `onHover`

```ts
/**
 * @param {LinkObject} link link Object
 * @param {CanvasRenderingContext2D} ctx node canvas context
 */
(link: LinkObject, ctx: CanvasRenderingContext2D) => {
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
    neighCtx.arc(x, y, 10, 0, Math.PI * 2); // full circle
    neighCtx.fillStyle = 'rgba(182, 181, 181, 0.5)';
    neighCtx.fill();
    neighCtx.stroke();
  };

  if (link.source) {
    (link.source as NodeObject).drawHighlight = drawHighlightFunc;
  }
  if (link.target) {
    (link.target as NodeObject).drawHighlight = drawHighlightFunc;
  }
}
```

#### `legendOptions` Props

| Prop            | Type                       | Default       | Description                                                                                 |
|-----------------|----------------------------|---------------|---------------------------------------------------------------------------------------------|
| `display`       | `boolean`                  | `true`        | Whether to show the legend.                                                                 |
| `position`      | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Position of the legend in the container.                |
| `containerStyle`| `React.CSSProperties`      | `undefined`   | Optional custom style object for the legend container.                                      |


#### `nodeLabelOptions` Props

| Prop               | Type            | Default                        | Description                                                       |
|--------------------|-----------------|--------------------------------|-------------------------------------------------------------------|
| `font`             | `string`        | `undefined`                    | Font family to use for labels (e.g., `'Arial'`, `'Roboto'`).     |
| `fontSize`         | `number`        | `4`                            | Size of the label font.                                           |
| `backgroundColor`  | `string`        | `undefined`                    | Optional background color behind the label.                       |
| `color`            | `string`        | `'rgba(39, 37, 37, 0.9)'`      | Color of the label text.                                          |
| `display`          | `boolean`       | `true`                         | Whether to display the label.                                     |
| `onZoomOutDisplay` | `boolean`       | `false`                        | Whether to continue showing the label when zoomed out.            |

#### `linkLabelOptions` Props

| Prop               | Type            | Default                        | Description                                                       |
|--------------------|-----------------|--------------------------------|-------------------------------------------------------------------|
| `font`             | `string`        | `undefined`                    | Font family to use for labels (e.g., `'Arial'`, `'Roboto'`).     |
| `fontSize`         | `number`        | `4`                            | Size of the label font.                                           |
| `backgroundColor`  | `string`        | `undefined`                    | Optional background color behind the label.                       |
| `color`            | `string`        | `'rgba(39, 37, 37, 0.9)'`      | Color of the label text.                                          |
| `display`          | `boolean`       | `true`                         | Whether to display the label.                                     |
| `onZoomOutDisplay` | `boolean`       | `false`                        | Whether to continue showing the label when zoomed out.            |

#### `directionOptions` Props

| Prop                                       | Type                                         | Default                        | Description                                                                 |
|--------------------------------------------|----------------------------------------------|--------------------------------|-----------------------------------------------------------------------------|
| `directionSize`                            | `number` \| `(link: LinkObject) => number`   | `4`                            | Size of the arrow indicating direction.                                     |
| `arrowRelativePositions`                   | `number` \| `(link: LinkObject) => number`   | `0.98`                         | Position of the arrow relative to the link length.                          |
| `directionalParticles`                     | `number` \| `(link: LinkObject) => number`   | `10`                           | Number of directional particles to display on a link.                       |
| `directionalParticleSize`                  | `number` \| `(link: LinkObject) => number`   | `1`                            | Size of directional particles.                                              |
| `directionalParticleSpeed`                 | `number` \| `(link: LinkObject) => number`   | `0.005`                        | Speed of directional particles.                                             |
| `directionalParticlesAndArrowColor`        | `string` \| `(link: LinkObject) => string`   | `'rgba(0, 0, 0, 0, 0)'`        | Color of both arrows and directional particles.                             |
| `onHoverParticlesSize`                     | `number`                                     | `4`                            | Size of directional particles on hover.                                     |
| `onHoverArrowSize`                         | `number`                                     | `undefined`                    | Optional custom arrow size on hover.                                        |
| `displayDirections`                        | `boolean`                                    | `true`                         | Whether to display link directions using arrows.                            |
| `displayParticles`                         | `boolean`                                    | `true`                         | Whether to display directional particles along the links (Greater than `0` will cause the canvas to be **continuously redrawn** to simulate particle motion). |

## 📚 Storybook

The project includes a [Storybook](https://storybook.js.org/) setup for developing, testing, and showcasing components in isolation.

### 🔧 Run Storybook locally

To start the Storybook server:

```bash
npm run storybook
```
This will launch Storybook at:
```
http://localhost:6006
```
You can visually explore all customizable props, states, and interactions of the Stix2Visualizer component from there.

## 🧱 Interfaces & Types

### `ILabelOptions`

```ts
interface ILabelOptions {
  font?: string;
  fontSize?: number;
  backgroundColor?: string;
  color?: string;
  display?: boolean;
  onZoomOutDisplay?: boolean;
}
```
Used to style and control label rendering for nodes and links.


### `INodeOptions`

```ts
interface INodeOptions {
  size?: number;
  disableZoomOnClick?: boolean;
  onHover?: (
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    highlightedNeighbors: Set<NodeObject>
  ) => void;
  onClick?: (node: NodeObject, ref?: ReactForceRef) => void;
}
```
Controls how nodes behave, appear, and respond to interaction.


### `ILinkOptions`

```ts
interface ILinkOptions {
  width?: ((link: LinkObject) => number) | number;
  curvature?: number;
  distance?: number;
  color?: string;
  disableZoomOnClick?: boolean;
  onHover?: (link: LinkObject, ctx: CanvasRenderingContext2D) => void;
  onClick?: (link: LinkObject, ref?: ReactForceRef) => void;
}
```
Defines link styling, interaction behavior, and rendering logic.


### `ILinkDirectionOptions`

```ts
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
```
Configures directional arrows and animated particles on links.

> ⚠️ **Performance Note**  
> If `directionalParticles` is greater than `0`, the canvas will be **continuously redrawn** to simulate particle motion.  
> This may **impact performance** on large graphs. Use this option **with caution**.

### `ILegendOptions`

```ts
type LegendPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

interface ILegendOptions {
  display?: boolean;
  position?: LegendPosition;
  containerStyle?: React.CSSProperties;
}
```

### `NodeObject`

```ts
type NodeObject<NodeType = object> = NodeType & {
  id: string | number;
  img?: HTMLImageElement;
  size?: number;
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
  draw?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
  drawHighlight?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
  neighbors?: Array<NodeObject>;
  links?: Array<LinkObject>;
  [others: string]: unknown;
};  
```
Represents a node in the visualizer. This is a generic structure and can be extended with additional fields as needed.


### `LinkObject`

```ts
type LinkObject<NodeType = object, LinkType = object> = LinkType & {
  source?: string | number | NodeObject<NodeType>;
  target?: string | number | NodeObject<NodeType>;
  color?: string;
  [others: string]: unknown;
};
```
Defines a connection between two nodes. Can be enriched with custom properties.


## 🛠 Development

Follow these steps to set up the project locally for development:

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (version 20.10.0 or above recommended)
- npm or yarn

### 📥 Clone the repository and run

```bash
git clone https://github.com/your-org/stix-visualizer.git
cd stix-visualizer
npm run storybook
```

## 🤝 Contributing

Contributions are welcome!

- Fork the repository
- Create your feature branch:  
  ```bash
  git checkout -b feature/amazing-feature
  ```
- Commit your changes:
  ```bash
  git commit -m 'Add amazing feature'
  ```
- Push to the branch:
  ```bash
  git push origin feature/amazing-feature
  ```
- Open Pull Request

  

