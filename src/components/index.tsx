import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { createLabel, formatData, formatLegendLabel } from './utils';
import {
  ILabelOptions,
  Stix2VisualizerProps,
  LinkObject,
  NodeObject,
  Coordinates,
  ReactForceRef,
  ZoomTransformation,
  LegendPosition,
} from '../types';

/**
 * Only trigger if zoom-out is more than 20%
 */
const ZOOM_OUT_THRESHOLD = 0.8;
const DEFAULT_ZOOM_LEVEL = 3;

/**
 * @param {Stix2VisualizerProps} props properties
 * @returns {React.FC} Stix Visualizer Component
 */
export const Stix2Visualizer: React.FC<Stix2VisualizerProps> = (props) => {
  const properties: Stix2VisualizerProps = {
    data: props.data,
    noiseOptions: {
      ignoreReportObjectRefs: true,
      ...props.noiseOptions,
    },
    nodeOptions: {
      size: 12,
      disableZoomOnClick: false,
      /**
       * @param {NodeObject} node Node Object
       * @param {CanvasRenderingContext2D} ctx node canvas context
       * @param {Set<NodeObject>} neighbors node canvas context
       */
      onHover: (node: NodeObject, ctx: CanvasRenderingContext2D, neighbors: Set<NodeObject>) => {
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
        node.links?.forEach((link: LinkObject) => {
          link.particleWidth = 4;
        });
        if (node.img && node.x && node.y) {
          ctx.drawImage(node.img, node.x - 20 / 2, node.y - 20 / 2, 20, 20);
        }
      },
      ...props.nodeOptions,
    },
    linkOptions: {
      width: 1,
      color: 'rgba(126,126,126, 0.6)',
      distance: 60,
      curvature: 0.25,
      disableZoomOnClick: false,
      /**
       * @param {LinkObject} link link Object
       * @param {CanvasRenderingContext2D} ctx node canvas context
       */
      onHover: (link: LinkObject, ctx: CanvasRenderingContext2D) => {
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
      },
      ...props.linkOptions,
    },
    legendOptions: {
      displayignoreReportObjectRefsCheckBox: true,
      display: true,
      position: 'top-right',
      ...props.legendOptions,
    },
    nodeLabelOptions: {
      fontSize: 4,
      color: 'rgba(39, 37, 37, 0.9)',
      display: true,
      onZoomOutDisplay: false,
      ...props.nodeLabelOptions,
    },
    linkLabelOptions: {
      fontSize: 3,
      color: 'rgba(126,126,126, 0.9)',
      display: false,
      onZoomOutDisplay: false,
      ...props.linkLabelOptions,
    },
    directionOptions: {
      directionSize: 4,
      arrowRelativePositions: 0.98,
      /**
       * If directionalParticles > 0 canvas
       * will be made again and again due
       * to particle movement. Can be verfied
       * in drawNode callBack.
       */
      directionalParticles: 10,
      directionalParticleSize: 1,
      directionalParticleSpeed: 0.005,
      directionalParticlesAndArrowColor: 'rgba(0, 0, 0, 0, 0)',
      displayDirections: true,
      displayParticles: true,
      onHoverParticlesSize: 4,
      ...props.directionOptions,
    },
  };

  const initialZoomRef = useRef<number | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set<NodeObject>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<LinkObject>());
  const [hoverNode, setHoverNode] = useState<string | number | null>(null);
  const [ignoreNoise, setIgnoreNoise] = useState<boolean | undefined>(
    properties.noiseOptions?.ignoreReportObjectRefs
  );
  const fgRef = useRef<ReactForceRef | undefined>(undefined);

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
      if (properties.linkLabelOptions?.onZoomOutDisplay === false) {
        properties.linkLabelOptions.display = false;
      }
    } else {
      if (
        properties.nodeLabelOptions?.onZoomOutDisplay === false &&
        properties.nodeLabelOptions?.display === false
      ) {
        properties.nodeLabelOptions.display = true;
      }
      if (
        properties.linkLabelOptions?.onZoomOutDisplay === false &&
        properties.linkLabelOptions?.display === false
      ) {
        properties.linkLabelOptions.display = true;
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
      if (!properties.nodeOptions?.disableZoomOnClick && node.x && node.y) {
        fgRef.current?.centerAt(node.x, node.y, 1000); // center smoothly
        fgRef.current?.zoom(DEFAULT_ZOOM_LEVEL, 1000); // zoom smoothly
      }
      if (properties.nodeOptions?.onClick) {
        properties.nodeOptions.onClick(node, fgRef.current);
      }
    },
    [fgRef, properties.nodeOptions?.onClick]
  );

  /**
   * Handles the click event on a graph node.
   * @param {LinkObject} node - The node object that was clicked.
   * @returns {void}
   */
  const handleLinkClick = useCallback(
    (link: LinkObject): void => {
      if (!properties.linkOptions?.disableZoomOnClick) {
        const source = link.source as NodeObject;
        const target = link.target as NodeObject;

        // Ensure both nodes have coordinates
        if (source.x && source.y && target.x && target.y) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;

          fgRef.current?.centerAt(midX, midY, 1000);
          fgRef.current?.zoom(DEFAULT_ZOOM_LEVEL, 1000);
        }
      }
      if (properties.linkOptions?.onClick) {
        properties.linkOptions.onClick(link, fgRef.current);
      }
    },
    [fgRef, properties.linkOptions?.onClick]
  );

  const transformedGraphData = useMemo(() => {
    const data = formatData(properties.data, 0.1, ignoreNoise);
    return data;
  }, [properties.data, ignoreNoise]);

  useEffect(() => {
    const fg = fgRef.current;
    /**
     * By default distance is automatically
     * adjusted between two two links.
     */
    if (
      properties.linkOptions?.distance &&
      typeof properties.linkOptions?.distance === 'number' &&
      fg
    ) {
      fg.d3Force('link')?.distance(properties.linkOptions?.distance); // same as linkDistance
    }
  }, [properties.linkOptions?.distance]);

  /**
   * Updates the currently highlighted elements (e.g., nodes or links) in the graph.
   * @returns {void}
   */
  const updateHighlight = (): void => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  /**
   * Updates hover objects in their states
   * @param { NodeObject | null} node Node Object
   * @returns {void}
   */
  const handleNodeHover = (node: NodeObject | null): void => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node?.neighbors?.forEach((neighbor: NodeObject) => {
        return highlightNodes.add(neighbor);
      });
    }
    setHoverNode(node?.id || null);
    updateHighlight();
  };

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
    }

    updateHighlight();
  };

  /**
   * Custom rendering function for drawing a node on the canvas.
   * @param {NodeObject} link - The node object to be rendered.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   * @returns {void}
   */
  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D): void => {
      const size = Number(node.size) || properties.nodeOptions?.size || 0;
      if (node.x && node.y && node.img) {
        ctx.drawImage(node.img, node.x - size / 2, node.y - size / 2, size, size);
        if (node.drawHighlight) {
          if (highlightNodes.size > 0 || highlightLinks.size > 0) {
            node.drawHighlight(ctx, node.x, node.y);
          } else {
            /**
             * clear draw when hover is removed.
             */
            node.drawHighlight = undefined;
          }
        }
        node.draw?.(ctx, node.x, node.y);
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
      if (properties.nodeOptions?.onHover && node.id === hoverNode) {
        properties.nodeOptions?.onHover(node, ctx, highlightNodes as Set<NodeObject>);
      }
    },
    [hoverNode]
  );

  /**
   * Custom rendering function for drawing a link on the canvas.
   * @param {LinkObject} link - The link object to be rendered.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
   * @returns {void}
   */
  const drawLink = useCallback(
    (link: LinkObject, ctx: CanvasRenderingContext2D): void => {
      let labelOptions: ILabelOptions | undefined = undefined;
      if (link.label) {
        labelOptions = {
          fontSize: properties.linkLabelOptions?.fontSize,
          backgroundColor: properties.linkLabelOptions?.backgroundColor,
          color: properties.linkLabelOptions?.color,
          font: properties.linkLabelOptions?.font,
          display: properties.linkLabelOptions?.display,
        };
      }
      const color: string = link.color || properties.linkOptions?.color || '#0000';
      const width = link.width || properties.linkOptions?.width || 0;
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
        properties.linkOptions?.curvature || 0,
        color,
        width as number,
        link.label as string,
        labelOptions
      );
      if (highlightNodes.size > 0 || highlightLinks.size > 0) {
        if (link.drawHighlight) {
          link.drawHighlight(ctx);
        }
      } else {
        link.drawHighlight = undefined;
        link.particleWidth = undefined;
      }
      if (highlightNodes.size <= 0 && properties.linkOptions?.onHover && highlightLinks.has(link)) {
        properties.linkOptions.onHover(link, ctx);
      }
    },
    [fgRef]
  );

  /**
   * Computes the particle width for a given graph link.
   * @param {LinkObject} link - The link object for which to calculate the particle width.
   * @returns {number} The width of the particle to render on the link.
   */
  const particleWidth = useCallback(
    (link: LinkObject): number => {
      if (typeof link.particleWidth === 'number') {
        return link.particleWidth;
      } else if (highlightLinks.has(link)) {
        return properties.directionOptions?.onHoverParticlesSize || 0;
      } else if (typeof properties.directionOptions?.directionalParticleSize === 'number') {
        return properties.directionOptions?.directionalParticleSize;
      } else if (properties.directionOptions?.directionalParticleSize) {
        properties.directionOptions?.directionalParticleSize(link);
      }
      return 0;
    },
    [fgRef]
  );

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

  const positionStyles: Record<LegendPosition, React.CSSProperties> = {
    'top-left': { top: 10, left: 10 },
    'top-right': { top: 10, right: 10 },
    'bottom-left': { bottom: 10, left: 10 },
    'bottom-right': { bottom: 10, right: 10 },
    'top-center': { top: 10, left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: 10, left: '50%', transform: 'translateX(-50%)' },
  };

  return (
    <div>
      {properties.legendOptions?.display && properties.legendOptions.position && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            border: '1px dashed #999',
            borderRadius: '8px',
            ...positionStyles[properties.legendOptions.position],
            ...properties.legendOptions.containerStyle,
          }}
        >
          {properties.legendOptions?.displayignoreReportObjectRefsCheckBox && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                borderBottom: '1px dashed #999',
              }}
            >
              <label>
                <input
                  style={{ width: 15, height: 15, marginRight: 8 }}
                  type="checkbox"
                  checked={ignoreNoise}
                  onChange={() => {
                    if (properties.noiseOptions) {
                      properties.noiseOptions.ignoreReportObjectRefs = !ignoreNoise;
                      setIgnoreNoise(!ignoreNoise);
                    }
                  }}
                />
                Reduce Noise (If Possible)
              </label>
              {/* <span>{formatLegendLabel(legend.type)}</span> */}
            </div>
          )}
          {transformedGraphData.legends.map((legend, index) => {
            return (
              <div
                key={index}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}
              >
                {legend.icon && (
                  <img
                    src={legend.icon.src}
                    alt={legend.type}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                  />
                )}
                <span>{formatLegendLabel(legend.type)}</span>
              </div>
            );
          })}
        </div>
      )}
      <ForceGraph2D
        ref={fgRef}
        graphData={transformedGraphData.data}
        nodeId="aarpaarId"
        /**
         * - Node Props
         */
        nodeCanvasObject={drawNode}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeRelSize={properties.nodeOptions?.size}
        /**
         * - Link Props
         */
        linkCanvasObject={drawLink}
        onLinkClick={handleLinkClick}
        linkColor={ArrowAndParticleColor}
        onLinkHover={handleLinkHover}
        linkCurvature={properties.linkOptions?.curvature}
        /**
         * - Direction Arrow Props
         */
        linkDirectionalArrowLength={
          properties.directionOptions?.displayDirections
            ? properties.directionOptions?.directionSize
            : 0
        }
        linkDirectionalArrowRelPos={properties.directionOptions?.arrowRelativePositions}
        /**
         * - Direction Particle Props
         */
        linkDirectionalParticles={properties.directionOptions?.directionalParticles}
        linkDirectionalParticleSpeed={properties.directionOptions?.directionalParticleSpeed}
        linkDirectionalParticleWidth={
          properties.directionOptions?.displayParticles ? particleWidth : undefined
        }
        /**
         * - Canvas Zoom Props
         */
        cooldownTicks={50}
        onEngineStop={() => {
          return fgRef.current?.zoomToFit(400);
        }}
        onZoom={handleZoom}
      />
    </div>
  );
};
