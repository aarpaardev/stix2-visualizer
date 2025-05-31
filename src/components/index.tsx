import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
import { createLabel, formatData, loadIcons } from './utils';
import { GraphData, ILabelOptions, IStix2Visualizer, LinkObject, NodeObject } from '../stix2-visualizer';
// import { IRelationLabelOptions } from './types';

// const defaultValues = {
//   curvature: 0.25,
//   particlesColor: 'rgb(0, 0, 0)',
//   linkWidth: 1,
//   linkLabelFontSize: 5,
// }
// const icons = loadIcons('round');
// const dataSample: GraphData = {
//   "nodes": [ 
//       { 
//         "id": "id1",
//         "img":  icons.artifact, //"stix2.png", //"C:\\Users\\mmali\\Downloads\\stix2_artifact_icon_tiny_round_v1.png",
//         "name": "name1",
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id2",
//         "img":  icons.attack_pattern,
//         "name": "name2",
//         "val": 0.2,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id3",
//         "name": "name3",
//         "img":  icons.autonomous_system,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id4",
//         "name": "name4",
//         "img":  icons.bundle,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id5",
//         "name": "name5",
//         "img":  icons.course_of_action,
//         "val": 0.2,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id6",
//         "name": "name6",
//         "img":  icons.domain_name,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id7",
//         "name": "name7",
//         "img":  icons.email_message,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id8",
//         "name": "name8",
//         "img":  icons.http,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id9",
//         "name": "name9",
//         "img":  icons.incident,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id10",
//         "name": "name10",
//         "img":  icons.ipv4_addr,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id11",
//         "name": "name11",
//         "img":  icons.intrusion_set,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id14",
//         "name": "id14",
//         "img":  icons.impact,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//       { 
//         "id": "id15",
//         "name": "id15",
//         "img":  icons.ipv6_addr,
//         "val": 0.1,
//         neighbors:[],
//         links: [] 
//       },
//   ],
//   "links": [
//       {
//           "source": "id1",
//           "target": "id2",
//           "label": "Me"
//       },
//       {
//           "source": "id1",
//           "target": "id3",
//           "label": "Kancha"
//       },
//       {
//           "source": "id1",
//           "target": "id4"
//       },
//       {
//           "source": "id2",
//           "target": "id5"
//       },
//       {
//           "source": "id2",
//           "target": "id6"
//       },
//       {
//           "source": "id3",
//           "target": "id7"
//       },
//       {
//           "source": "id3",
//           "target": "id8"
//       },
//       {
//           "source": "id4",
//           "target": "id9"
//       },
//       {
//           "source": "id4",
//           "target": "id10"
//       },
//       {
//           "source": "id5",
//           "target": "id11"
//       },
//       {
//           "source": "id14",
//           "target": "id15"
//       },
//   ]
// }

// function genRandomTree(N = 300, reverse = false): GraphData {
//     return {
//         nodes: [...Array(N).keys()].map(i => ({ id: i })),
//         links: [...Array(N).keys()]
//             .filter(id => id)
//             .map(id => ({
//                 [reverse ? 'target' : 'source']: id,
//                 [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
//             }))
//     };
// }



export const Stix2Visualizer: React.FC<IStix2Visualizer> = (props) => {
    const properties: IStix2Visualizer = {
      data: props.data,
      relationOptions: {
        disableDefaultHoverBehavior: false,
        color: 'rgba(126,126,126, 0.6)',
        distance: 60,
        curvature: 0.25,
        ...props.relationOptions
      },
      directionOptions: {
        arrowLength: 3.5,
        arrowRelativePositions: 0.95,
        directionalParticles: 10,
        directionalParticleWidth: 1,
        directionalParticleSpeed: 0.005,
        directionalParticlesAndArrowColor: 'rgba(0, 0, 0, 0, 0)',
        displayDirections: true,
        ...props.directionOptions
      },
      relationLabelOptions: {
        fontSize: 3 ,
        color: 'rgba(126,126,126, 0.9)',
        display: false,
        onZoomOutDisplay: false,
        ...props.relationLabelOptions,
      },
      nodeLabelOptions:{
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
      }

    }
    const fgRef = useRef<any>();
  const initialZoomRef  = useRef<number | null>(null); 
  const ZOOM_OUT_THRESHOLD = 0.80; // Only trigger if zoom-out is more than 20%
/**
 * Create a curved line
 * @param {CanvasRenderingContext2D} ctx canvas object
 * @param {{ x: number; y: number }} from starting x-axis and y-axis position
 * @param {{ x: number; y: number }} to ending x-axis and y-axis position
 * @param {number} curvature curvature of the line
 * @param {string} color background color of the line
 * @param {number} width width of the line
 * @param {ILabelOptions | undefined} labelOptions label to be displayed on the line
 * @returns {{ x: number; y: number }} from
 */
const drawCurvedLine = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  curvature: number,
  color: string,
  width: number,
  label?: string,
  labelOptions?: ILabelOptions,
) => {
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
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.quadraticCurveTo(cx, cy, to.x, to.y);
  // console.log('Libnk Color', color);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  if(labelOptions && label){
    // Compute midpoint of curve using quadratic Bézier formula at t=0.5
    const t = 0.5;
    const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * cx + t ** 2 * to.x;
    const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * cy + t ** 2 * to.y;
    createLabel(label, ctx, labelOptions, x, y);
  }

 
}

    const handleClick = useCallback((node: NodeObject) => {
        // Aim at node from outside it
        if(node.x && node.y && node.z){
            
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
            // alert(`${node.x}, ${node.y}, ${node.z}`);
            fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt ({ x, y, z })
                3000  // ms transition duration
            );
    }
    }, [fgRef]);

    const handleZoom = ({ k }: { k: number; x: number; y: number }) => {
    if (initialZoomRef.current === null) {
      initialZoomRef.current = k; // store initial zoom on first call
      return;
    }
    const initialZoom = initialZoomRef.current;
    console.log(initialZoom, k)
    if (k < initialZoom * ZOOM_OUT_THRESHOLD) {
      if(properties.nodeLabelOptions?.onZoomOutDisplay === false){
        properties.nodeLabelOptions.display = false;
      }
      if(properties.relationLabelOptions?.onZoomOutDisplay === false){
        properties.relationLabelOptions.display = false;
      }
      // Call your custom function here
    }
    else {
      if(properties.nodeLabelOptions?.onZoomOutDisplay === false && properties.nodeLabelOptions?.display === false){
        properties.nodeLabelOptions.display = true;
      }
      if(properties.relationLabelOptions?.onZoomOutDisplay === false && properties.relationLabelOptions?.display === false){
        properties.relationLabelOptions.display = true;
      }
    }
    // const prevZoom = prevZoomRef.current;

    // Detect significant zoom-out
    // if (k < prevZoom && (prevZoom - k) >= ZOOM_OUT_THRESHOLD) {
    //   if(properties.nodeLabelOptions?.onZoomOutDisplay === false){
    //     properties.nodeLabelOptions.display = false;
    //   }
    //   if(properties.relationLabelOptions?.onZoomOutDisplay === false){
    //     properties.relationLabelOptions.display = false;
    //   }
      
    //   console.log('📉 Significant Zoom Out!');
    //   // 🔁 Trigger your zoom-out function here
    // }
    // else{

    // }

    // Update previous zoom scale
    // prevZoomRef.current = k;
  };
const transformedGraph = useMemo(() => {
  return formatData(properties.data, 0.1);
}, [properties.data]);
    // const gData = graphData; //dataSample; // genRandomTree(40); //dataSample; //
    // console.log(gData);
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
          fg.d3Force('link').distance(properties.relationOptions?.distance); // same as linkDistance
      }
    }, [properties.relationOptions?.distance])
    // const data = useMemo(() => {

    //     // cross-link node objects
    //     gData?.links?.forEach(link => {
    //         if(link.source && link.target){
    //       const a = gData.nodes[link.source as unknown as number];
    //       const b = gData.nodes[link.target as unknown as number];
    //       a && !a.neighbors && (a.neighbors = []);
    //       b && !b.neighbors && (b.neighbors = []);
    //       a && a.neighbors.push(b);
    //       b && b.neighbors.push(a);

    //       a && !a.links && (a.links = []);
    //       b && !b.links && (b.links = []);
    //       a && a.links.push(link);
    //       b && b.links.push(link);
    //     }
    //     });

    //     return gData;
    //   }, []);

      const [highlightNodes, setHighlightNodes] = useState(new Set());
      const [highlightLinks, setHighlightLinks] = useState(new Set());
      const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);

      const updateHighlight = () => {
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

      const handleLinkHover = (link: LinkObject | null) => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
          highlightLinks.add(link);
          highlightNodes.add(link.source);
          highlightNodes.add(link.target);
        }

        updateHighlight();
      };
const drawNode = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D) => {
        const size = properties.nodeOptions?.size || 0;
        console.log('node');
        if(node.x && node.y && node.img){
          // console.log(node.img);
          ctx.drawImage(node.img, node.x - size / 2, node.y - size / 2, size, size);
       
        
        if(node.name && properties.nodeLabelOptions?.display){
          
        const labelOptions: ILabelOptions = {
            fontSize: properties.nodeLabelOptions?.fontSize,
            backgroundColor: properties.nodeLabelOptions?.backgroundColor,
            color: properties.nodeLabelOptions?.color,
            font: properties.nodeLabelOptions?.font,
            display: properties.nodeLabelOptions?.display
          } 
        // const t = 0.5;
        // const x = (1 - t) ** 2 * node.x + 2 * (1 - t) * t * node.fx + t ** 2 * to.x;
        // const y = (1 - t) ** 2 * node.y + 2 * (1 - t) * t * node.cy + t ** 2 * to.y;
        createLabel(node.name, ctx, labelOptions, node.x, node.y+(size / 2) + 5);
     }
    }
        
        // const label = node.name;
        //     const fontSize = 5;
        //     ctx.font = `${fontSize}px Sans-Serif`;
        //     const textWidth = ctx.measureText(node.label).width;
        //     // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

        //     // ctx.fillStyle = 'rgba(14, 13, 13, 0.8)';
        //     // ctx.fillRect((node.x) || 0 - bckgDimensions[0] / 2, node.y || 0  - bckgDimensions[1] / 2, bckgDimensions[0],
        //     // bckgDimensions[1]);

        //     ctx.textAlign = 'center';
        //     ctx.textBaseline = 'middle';
        //     ctx.fillStyle = node.color;
        //     ctx.fillText(label?.toString() || 'Label Not Found!', node.x || 0, (node.y || 0)+10);
      }, []);

      const drawLink = useCallback((link: LinkObject, ctx: CanvasRenderingContext2D) => {
        // console.log('bhauo')
        let labelOptions: ILabelOptions | undefined = undefined;
        if(link.label){
          labelOptions = {
            fontSize: properties.relationLabelOptions?.fontSize,
            backgroundColor: properties.relationLabelOptions?.backgroundColor,
            color: properties.relationLabelOptions?.color,
            font: properties.relationLabelOptions?.font,
            display: properties.relationLabelOptions?.display
          } 
        }
        const color:string = link.color || properties.relationOptions?.color || '#0000';
        const width = link.width || typeof properties.relationOptions?.width || 0;
        drawCurvedLine(ctx, {
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
        link.label,
        labelOptions
      );
            // const fontSize = 12/link.globalScale;
            // ctx.font = `${fontSize}px Sans-Serif`;
            // const textWidth = ctx.measureText(link.label).width;
            // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

            // ctx.fillStyle = 'rgba(14, 13, 13, 0.8)';
            // ctx.fillRect((link.x) || 0 - bckgDimensions[0] / 2, link.y || 0  - bckgDimensions[1] / 2, bckgDimensions[0],
            // bckgDimensions[1]);

            // ctx.textAlign = 'center';
            // ctx.textBaseline = 'middle';
            // ctx.fillStyle = link.color;
            // ctx.fillText(label?.toString() || 'Label Not Found!', link.x || 0, link.y || 0);
      
      }, []);

      const particleWidth = useCallback((link: LinkObject) => {
        // console.log('aaaaaa');
        if(highlightLinks.has(link)) {
          return 4;
        }
        else if(typeof properties.directionOptions?.directionalParticleWidth === 'number'){
          return properties.directionOptions?.directionalParticleWidth;
        }
        else if(properties.directionOptions?.directionalParticleWidth){
          properties.directionOptions?.directionalParticleWidth(link);
        }
        return 0;
      }, []);

      const linkWidth = useCallback((link: LinkObject) => {
        if(
          !properties.relationOptions?.disableDefaultHoverBehavior &&
          highlightLinks.has(link)
        ) {
          return 5;
        }
        else if(typeof properties.relationOptions?.width === 'number'){
          return properties.relationOptions?.width;
        }
        else if(properties.relationOptions?.width){
          properties.relationOptions?.width(link);
        }
        return 0;
      }, []);

      const paintRing = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D) => {
        // add ring just for highlighted nodes
        ctx.beginPath();
        if(node.x && node.y){
            ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
        }
        ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
        ctx.fill();
      }, [hoverNode]);
      console.log('AGAAAAAAAAAAIn')
      return <ForceGraph2D
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
       * Focus on Node
       */
      onNodeClick={handleClick}
      /**
       * Show Direction Particles
       */
      linkDirectionalParticles={properties.directionOptions?.directionalParticles}
      linkDirectionalParticleSpeed={properties.directionOptions?.directionalParticleSpeed}
      /**
       * Fit to Canvas when interacted with nodes
       */
      cooldownTicks={50}
      onEngineStop={() => fgRef.current.zoomToFit(400)}
      onZoom={handleZoom}
      /**
       * Highlight Nodes and Edges
       */
      nodeRelSize={NODE_R}
      linkWidth={linkWidth}
      linkDirectionalParticleWidth={particleWidth} // by default we are keeping 0.5 size for direction particles 
      // linkLabel={properties.relationLabelOptions?.l} //not needed
      linkColor={properties.directionOptions?.directionalParticlesAndArrowColor &&
        typeof properties.directionOptions.directionalParticlesAndArrowColor === 'string'? 
        /**
         * Its a bug in this library, so if a string is provided
         * pass it to the function to make it work.  
         */
        _ => properties.directionOptions?.directionalParticlesAndArrowColor as string :
        properties.relationOptions?.color}
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
      
  />;
    // return <ForceGraph3D
    //     nodeLabel="id"
    //     ref={fgRef}
    //     graphData={gData}
    //     linkDirectionalArrowLength={3.5}
    //     linkDirectionalArrowRelPos={1}
    //     linkCurvature={0.25}
    //     /**
    //      * Focus on Node
    //      */
    //     onNodeClick={handleClick}
    //     /**
    //      * Show Direction Particles
    //      */
    //     linkDirectionalParticles={10}
    //     linkDirectionalParticleSpeed={0.005}
    //     /**
    //      * Fit to Canvas when interacted with nodes
    //      */
    //     cooldownTicks={50}
    //     onEngineStop={() => fgRef.current.zoomToFit(400)}
    //     /**
    //      * Highlight Nodes and Edges
    //      */
    //     nodeRelSize={NODE_R}
    //     linkWidth={link => highlightLinks.has(link) ? 5 : 1}
    //     linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0.5} // by default we are keeping 0.5 size for direction particles 
    //     /**
    //      * Follwoing Highlighting features works only with 2D
    //      * ----------------------------------------------
    //      * autoPauseRedraw={false}
    //      * nodeCanvasObjectMode={(node: NodeObject) => highlightNodes.has(node) ? 'before' : undefined}
    //      * nodeCanvasObject={paintRing}
    //      */
    //     onNodeHover={handleNodeHover}
    //     onLinkHover={handleLinkHover}
    //     // nodeThreeObject={({ img }: Record<string, string>) => {
    //     //     console.log(img);
    //     //     const imgTexture = new THREE.TextureLoader().load(`../assets/stixIcons/stix2.png`);
    //     //     imgTexture.colorSpace = THREE.SRGBColorSpace;
    //     //     const material = new THREE.SpriteMaterial({ map: imgTexture });
    //     //     const sprite = new THREE.Sprite(material);
    //     //     sprite.scale.set(12, 12, 1);
  
    //     //     return sprite;
    //     //   }}
    //     // nodeThreeObject={}
        
    // />;
} 