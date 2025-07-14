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

| Prop                 | Type                              | Default Value                                        | Description |
|----------------------|-----------------------------------|------------------------------------------------------|-------------|
| `data`               | `StixBundle \| object`            | **Required**                                         | STIX bundle or any valid STIX-compatible object |
| `nodeOptions`        | `INodeOptions`                    | `{ size: 12, disableZoomOnClick: false, ...}`        | Customize node size, hover, click, and zoom behavior |
| `linkOptions`        | `ILinkOptions`                    | `{ width: 1, curvature: 0.25, ...}`                  | Control link appearance, hover, click, and zoom behavior |
| `legendOptions`      | `ILegendOptions`                  | `{ display: true, position: 'top-right' }`           | Show/hide the legend and set its position on screen |
| `directionOptions`   | `ILinkDirectionOptions`           | `{ directionalParticles: 10, displayDirections: true, ...}` | Configure particle and arrow animations on links |
| `nodeLabelOptions`   | `ILabelOptions`                   | `{ fontSize: 4, color: 'rgba(39,37,37,0.9)', display: true }` | Control font, color, visibility, and zoom-out behavior of node labels |
| `linkLabelOptions`   | `ILabelOptions`                   | `{ fontSize: 3, color: 'rgba(126,126,126,0.9)', display: false }` | Control font, color, visibility, and zoom-out behavior of link labels |


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

## 🧱 Interfaces

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
Manages whether the legend is shown and where it appears on screen.

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

  

