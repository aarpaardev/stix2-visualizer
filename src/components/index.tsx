import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { createLabel, formatData } from './utils';
import { ILabelOptions, IStix2Visualizer, LinkObject, NodeObject } from '../stix2-visualizer';
import { Coordinates, ReactForceRef, ZoomTransformation } from './types';

/**
 * Only trigger if zoom-out is more than 20%
 */
const ZOOM_OUT_THRESHOLD = 0.8;
/**
 * @param {IStix2Visualizer} props properties
 * @returns {React.FC} Stix Visualizer Component
 */
export const Stix2Visualizer: React.FC<IStix2Visualizer> = (props) => {
  const properties: IStix2Visualizer = {
    data: props.data,
    relationOptions: {
      disableDefaultHoverBehavior: false,
      color: 'rgba(126,126,126, 0.6)',
      distance: 60,
      curvature: 0.25,
      ...props.relationOptions,
    },
    directionOptions: {
      arrowLength: 3.5,
      arrowRelativePositions: 0.95,
      directionalParticles: 10,
      directionalParticleWidth: 1,
      directionalParticleSpeed: 0.005,
      directionalParticlesAndArrowColor: 'rgba(0, 0, 0, 0, 0)',
      displayDirections: true,
      ...props.directionOptions,
    },
    relationLabelOptions: {
      fontSize: 3,
      color: 'rgba(126,126,126, 0.9)',
      display: false,
      onZoomOutDisplay: false,
      ...props.relationLabelOptions,
    },
    nodeLabelOptions: {
      fontSize: 4,
      color: 'rgba(39, 37, 37, 0.9)',
      display: true,
      onZoomOutDisplay: false,
      ...props.nodeLabelOptions,
    },
    nodeOptions: {
      size: 12,
      disableDefaultHoverBehavior: false,
      ...props.nodeOptions,
    },
  };

  const fgRef = useRef<ReactForceRef>();
  const initialZoomRef = useRef<number | null>(null);

  /**
   * Create a curved line
   * @param {CanvasRenderingContext2D} ctx canvas object
   * @param {Coordinates} from starting x-axis and y-axis position
   * @param {Coordinates} to ending x-axis and y-axis position
   * @param {number} curvature curvature of the line
   * @param {string} color background color of the line
   * @param {number} width width of the line
   * @param {string} label label to be dispalyed
   * @param {ILabelOptions | undefined} labelOptions label to be displayed on the line
   * @returns {void}
   */
  const drawCurvedLine = (
    ctx: CanvasRenderingContext2D,
    from: Coordinates,
    to: Coordinates,
    curvature: number,
    color: string,
    width: number,
    label?: string,
    labelOptions?: ILabelOptions
  ): void => {
    /**
     * Calculate Midpoint
     */
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;

    /**
     * Calculate Vector from start to end
     */
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    /**
     * Rotate 90 degrees and apply curvature
     */
    const cx = mx + curvature * dy;
    const cy = my - curvature * dx;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(cx, cy, to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    if (labelOptions && label) {
      /**
       * Compute midpoint of curve using quadratic Bézier formula at t=0.5
       */
      const t = 0.5;
      const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * cx + t ** 2 * to.x;
      const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * cy + t ** 2 * to.y;
      createLabel(label, ctx, labelOptions, x, y);
    }
  };

  /**
   * @param {ZoomTransformation} transform transformed coordinates
   * @returns {void}
   */
  const handleZoom = (transform: ZoomTransformation): void => {
    const { k } = transform;
    if (initialZoomRef.current === null) {
      /**
       * store initial zoom on first call
       */
      initialZoomRef.current = k;
      return;
    }
    const initialZoom = initialZoomRef.current;
    if (k < initialZoom * ZOOM_OUT_THRESHOLD) {
      if (properties.nodeLabelOptions?.onZoomOutDisplay === false) {
        properties.nodeLabelOptions.display = false;
      }
      if (properties.relationLabelOptions?.onZoomOutDisplay === false) {
        properties.relationLabelOptions.display = false;
      }
    } else {
      if (
        properties.nodeLabelOptions?.onZoomOutDisplay === false &&
        properties.nodeLabelOptions?.display === false
      ) {
        properties.nodeLabelOptions.display = true;
      }
      if (
        properties.relationLabelOptions?.onZoomOutDisplay === false &&
        properties.relationLabelOptions?.display === false
      ) {
        properties.relationLabelOptions.display = true;
      }
    }
  };

  /**
   * Handles the click event on a graph node.
   * @param {NodeObject} node - The node object that was clicked.
   * @returns {void}
   */
  const handleNodeClick = useCallback(
    (node: NodeObject): void => {
      // Aim at node from outside it
      console.log('clicked');
      console.log('ok', node);
      if (node.x && node.y) {
        fgRef.current?.centerAt(node.x, node.y, 1000); // center smoothly
        fgRef.current?.zoom(3, 1000); // zoom smoothly
      }
    },
    [fgRef]
  );

  /**
   * Handles the click event on a graph node.
   * @param {LinkObject} node - The node object that was clicked.
   * @returns {void}
   */
  const handleLinkClick = useCallback(
    (link: LinkObject): void => {
      const source = link.source as NodeObject;
      const target = link.target as NodeObject;

      // Ensure both nodes have coordinates
      if (source.x && source.y && target.x && target.y) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        const zoomLevel = 2; // adjust zoom level as needed

        fgRef.current?.centerAt(midX, midY, 1000);
        fgRef.current?.zoom(zoomLevel, 1000);
      }
    },
    [fgRef]
  );
  const transformedGraph = useMemo(() => {
    return formatData(properties.data, 0.1);
  }, [properties.data]);
  const NODE_R = 8;
  useEffect(() => {
    const fg = fgRef.current;
    /**
     * By default distance is automatically
     * adjusted between two two links.
     */
    if (
      properties.relationOptions?.distance &&
      typeof properties.relationOptions?.distance === 'number' &&
      fg
    ) {
      fg.d3Force('link')?.distance(properties.relationOptions?.distance); // same as linkDistance
    }
  }, [properties.relationOptions?.distance]);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  // const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);

  /**
   * Updates the currently highlighted elements (e.g., nodes or links) in the graph.
   * @returns {void}
   */
  const updateHighlight = (): void => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  // const handleNodeHover = (node: NodeObject | null) => {
  //   highlightNodes.clear();
  //   highlightLinks.clear();
  //   if (node) {
  //     highlightNodes.add(node);
  //     node?.neighbors?.forEach((neighbor: unknown) => highlightNodes.add(neighbor));
  //     node?.links?.forEach((link: unknown) => highlightLinks.add(link));
  //   }

  //   setHoverNode(node || null);
  //   updateHighlight();
  // };

  /**
   * Handles the hover event for a link in the graph.
   * @param {LinkObject | null} link - The link object being hovered over, or null if no link is hovered.
   * @returns {void}
   */
  const handleLinkHover = (link: LinkObject | null): void => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  /**
   * Custom rendering function for drawing a node on the canvas.
   * @param {NodeObject} link - The node object to be rendered.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   * @returns {void}
   */
  const drawNode = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D): void => {
    const size = properties.nodeOptions?.size || 0;
    if (node.x && node.y && node.img) {
      ctx.drawImage(node.img, node.x - size / 2, node.y - size / 2, size, size);

      if (node.name && properties.nodeLabelOptions?.display) {
        const labelOptions: ILabelOptions = {
          fontSize: properties.nodeLabelOptions?.fontSize,
          backgroundColor: properties.nodeLabelOptions?.backgroundColor,
          color: properties.nodeLabelOptions?.color,
          font: properties.nodeLabelOptions?.font,
          display: properties.nodeLabelOptions?.display,
        };
        createLabel(node.name, ctx, labelOptions, node.x, node.y + size / 2 + 5);
      }
    }
  }, []);

  /**
   * Custom rendering function for drawing a link on the canvas.
   * @param {LinkObject} link - The link object to be rendered.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   * @returns {void}
   */
  const drawLink = useCallback((link: LinkObject, ctx: CanvasRenderingContext2D): void => {
    let labelOptions: ILabelOptions | undefined = undefined;
    if (link.label) {
      labelOptions = {
        fontSize: properties.relationLabelOptions?.fontSize,
        backgroundColor: properties.relationLabelOptions?.backgroundColor,
        color: properties.relationLabelOptions?.color,
        font: properties.relationLabelOptions?.font,
        display: properties.relationLabelOptions?.display,
      };
    }
    const color: string = link.color || properties.relationOptions?.color || '#0000';
    const width = link.width || typeof properties.relationOptions?.width || 0;
    drawCurvedLine(
      ctx,
      {
        x: (link.source as NodeObject)?.x || 0,
        y: (link.source as NodeObject)?.y || 0,
      },
      {
        x: (link.target as NodeObject)?.x || 0,
        y: (link.target as NodeObject)?.y || 0,
      },
      properties.relationOptions?.curvature || 0,
      color,
      width as number,
      link.labela as string,
      labelOptions
    );
  }, []);

  /**
   * Computes the particle width for a given graph link.
   * @param {LinkObject} link - The link object for which to calculate the particle width.
   * @returns {number} The width of the particle to render on the link.
   */
  const particleWidth = useCallback((link: LinkObject): number => {
    if (highlightLinks.has(link)) {
      return 4;
    } else if (typeof properties.directionOptions?.directionalParticleWidth === 'number') {
      return properties.directionOptions?.directionalParticleWidth;
    } else if (properties.directionOptions?.directionalParticleWidth) {
      properties.directionOptions?.directionalParticleWidth(link);
    }
    return 0;
  }, []);

  /**
   * Computes the link width for a given graph link.
   * @param {LinkObject} link - The link object for which to calculate the particle width.
   * @returns {number} The width of the link to render on the link.
   */
  const linkWidth = useCallback((link: LinkObject): number => {
    if (!properties.relationOptions?.disableDefaultHoverBehavior && highlightLinks.has(link)) {
      return 5;
    } else if (typeof properties.relationOptions?.width === 'number') {
      return properties.relationOptions?.width;
    } else if (properties.relationOptions?.width) {
      properties.relationOptions?.width(link);
    }
    return 0;
  }, []);

  /**
   * Determines the particle and arrow color for a given graph link.
   * @param {LinkObject} link - The link object.
   * @returns {string} The color of moving particles and arrow.
   */
  const ArrowAndParticleColor = useCallback((link: LinkObject): string => {
    /**
     * Its a bug in this library, so if a string is provided
     * pass it to the function to make it work.
     */
    if (typeof properties.directionOptions?.directionalParticlesAndArrowColor === 'string') {
      return properties.directionOptions?.directionalParticlesAndArrowColor;
    } else if (properties.directionOptions?.directionalParticlesAndArrowColor) {
      return properties.directionOptions?.directionalParticlesAndArrowColor(link);
    }
    return '#00000';
  }, []);

  // const paintRing = useCallback(
  //   (node: NodeObject, ctx: CanvasRenderingContext2D) => {
  //     // add ring just for highlighted nodes
  //     ctx.beginPath();
  //     if (node.x && node.y) {
  //       ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
  //     }
  //     ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
  //     ctx.fill();
  //   },
  //   [hoverNode]
  // );
  console.log('AGAAAAAAAAAAIn');
  return (
    <ForceGraph2D
      nodeLabel="id"
      ref={fgRef}
      graphData={transformedGraph}
      linkDirectionalArrowLength={properties.directionOptions?.arrowLength}
      linkDirectionalArrowRelPos={properties.directionOptions?.arrowRelativePositions}
      linkCurvature={properties.relationOptions?.curvature}
      nodeCanvasObject={drawNode}
      // nodePointerAreaPaint={(node, color, ctx) => {
      //   if(node.x && node.y){
      //     const size = 12;
      //     ctx.fillStyle = color;
      //     ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size); // draw square as pointer trap
      // }
      // }}
      /**
       * Focus on Node and Link
       */
      onNodeClick={handleNodeClick}
      onLinkClick={handleLinkClick}
      /**
       * Show Direction Particles
       */
      linkDirectionalParticles={properties.directionOptions?.directionalParticles}
      linkDirectionalParticleSpeed={properties.directionOptions?.directionalParticleSpeed}
      /**
       * Fit to Canvas when interacted with nodes
       */
      cooldownTicks={50}
      onEngineStop={() => {
        return fgRef.current?.zoomToFit(400);
      }}
      onZoom={handleZoom}
      /**
       * Highlight Nodes and Edges
       */
      nodeRelSize={NODE_R}
      linkWidth={linkWidth}
      linkDirectionalParticleWidth={particleWidth} // by default we are keeping 0.5 size for direction particles
      // linkLabel={properties.relationLabelOptions?.l} //not needed
      linkColor={ArrowAndParticleColor}
      linkCanvasObject={drawLink}
      /**
       * Follwoing Highlighting features works only with 2D
       * ----------------------------------------------
       * autoPauseRedraw={false}
       * nodeCanvasObjectMode={(node: NodeObject) => highlightNodes.has(node) ? 'before' : undefined}
       * nodeCanvasObject={paintRing}
       */
      // onNodeHover={handleNodeHover}
      onLinkHover={handleLinkHover}
      // nodeThreeObject={}
    />
  );
};
