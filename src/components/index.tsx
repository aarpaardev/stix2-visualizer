import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
import { drawCurvedLine, loadIcons } from './utils';
import { IStix2Visualizer, LinkObject, NodeObject } from '../stix2-visualizer';
import { IRelationLabelOptions } from './types';

interface GraphData<NodeType = {}, LinkType = {}> {
  nodes: NodeObject<NodeType>[];
  links: LinkObject<NodeType, LinkType>[];
}

const defaultValues = {
  curvature: 0.25,
  linkColor: '#00c00a',
  linkWidth: 1,
  linkLabelFontSize: 5
}
const icons = loadIcons('round');
const dataSample: GraphData<NodeObject<{}>, LinkObject<{}, {}>> = {
  "nodes": [ 
      { 
        "id": "id1",
        "img":  icons.artifact, //"stix2.png", //"C:\\Users\\mmali\\Downloads\\stix2_artifact_icon_tiny_round_v1.png",
        "name": "name1",
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id2",
        "img":  icons.attack_pattern,
        "name": "name2",
        "val": 0.2,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id3",
        "name": "name3",
        "img":  icons.autonomous_system,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id4",
        "name": "name4",
        "img":  icons.bundle,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id5",
        "name": "name5",
        "img":  icons.course_of_action,
        "val": 0.2,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id6",
        "name": "name6",
        "img":  icons.domain_name,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id7",
        "name": "name7",
        "img":  icons.email_message,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id8",
        "name": "name8",
        "img":  icons.http,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id9",
        "name": "name9",
        "img":  icons.incident,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id10",
        "name": "name10",
        "img":  icons.ipv4_addr,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id11",
        "name": "name11",
        "img":  icons.intrusion_set,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id14",
        "name": "id14",
        "img":  icons.impact,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
      { 
        "id": "id15",
        "name": "id15",
        "img":  icons.ipv6_addr,
        "val": 0.1,
        neighbors:[],
        links: [] 
      },
  ],
  "links": [
      {
          "source": "id1",
          "target": "id2",
          "label": "Me"
      },
      {
          "source": "id1",
          "target": "id3",
          "label": "Kancha"
      },
      {
          "source": "id1",
          "target": "id4"
      },
      {
          "source": "id2",
          "target": "id5"
      },
      {
          "source": "id2",
          "target": "id6"
      },
      {
          "source": "id3",
          "target": "id7"
      },
      {
          "source": "id3",
          "target": "id8"
      },
      {
          "source": "id4",
          "target": "id9"
      },
      {
          "source": "id4",
          "target": "id10"
      },
      {
          "source": "id5",
          "target": "id11"
      },
      {
          "source": "id14",
          "target": "id15"
      },
  ]
}
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
      relationOptions: {
        width: props?.relationOptions?.width ?? defaultValues.linkWidth,
        color: props?.relationOptions?.color ?? '#00c00a',
        curvature: props?.relationOptions?.curvature ?? defaultValues.curvature,
        ...props.relationOptions
      },
      directionOptions: {
        arrowLength: props?.directionOptions?.arrowLength ?? 3.5,
        arrowRelativePositions: props?.directionOptions?.arrowRelativePositions ?? 0.95,
        directionalParticleWidth: props?.directionOptions?.directionalParticleSpeed ?? 0.5,
        directionalParticles: props?.directionOptions?.directionalParticles ?? 10,
        directionalParticleSpeed: props?.directionOptions?.directionalParticleSpeed ?? 0.005,
        directionalParticlesColor: props?.directionOptions?.directionalParticlesColor ?? '#00c00a',
        displayDirections: props?.directionOptions?.displayDirections ?? true,
        ...props.directionOptions
      },
      relationLabelOptions:{
        labelFontSize: props?.relationLabelOptions?.labelFontSize ?? defaultValues.linkLabelFontSize,
        labelColor: props?.relationLabelOptions?.labelColor ?? '#000000',
        displayLabel: props?.relationLabelOptions?.displayLabel ?? true,
        ...props.relationLabelOptions,
      }
    }
    const fgRef = useRef<any>();

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

    const gData = dataSample; // genRandomTree(40); //dataSample; //
    console.log(gData);
    const NODE_R = 8;
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

      const handleNodeHover = (node: NodeObject | null) => {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
          highlightNodes.add(node);
          node?.neighbors?.forEach((neighbor: unknown) => highlightNodes.add(neighbor));
          node?.links?.forEach((link: unknown) => highlightLinks.add(link));
        }

        setHoverNode(node || null);
        updateHighlight();
      };

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

      const paintRing = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D) => {
        // add ring just for highlighted nodes
        ctx.beginPath();
        if(node.x && node.y){
            ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
        }
        ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
        ctx.fill();
      }, [hoverNode]);
      return <ForceGraph2D
      nodeLabel="id"
      ref={fgRef}
      graphData={gData}
      linkDirectionalArrowLength={properties.directionOptions?.arrowLength}
      linkDirectionalArrowRelPos={properties.directionOptions?.arrowRelativePositions}
      linkCurvature={properties.relationOptions?.curvature}
      nodeCanvasObject={(node, ctx) => {
        const size = 12;
        if(node.x && node.y && node.img){
          console.log(node.img);
          ctx.drawImage(node.img, node.x - size / 2, node.y - size / 2, size, size);
        }
        const label = node.id;
            const fontSize = 5;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(node.label).width;
            // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

            // ctx.fillStyle = 'rgba(14, 13, 13, 0.8)';
            // ctx.fillRect((node.x) || 0 - bckgDimensions[0] / 2, node.y || 0  - bckgDimensions[1] / 2, bckgDimensions[0],
            // bckgDimensions[1]);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = node.color;
            ctx.fillText(label?.toString() || 'Label Not Found!', node.x || 0, (node.y || 0)+10);
      }}
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
      /**
       * Highlight Nodes and Edges
       */
      nodeRelSize={NODE_R}
      linkWidth={link => highlightLinks.has(link) ? 5 : 1}
      linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0.5} // by default we are keeping 0.5 size for direction particles 
      linkLabel={properties.relationLabelOptions?.labelOnHover}
      linkColor={properties.directionOptions?.directionalParticlesColor &&
        typeof properties.directionOptions.directionalParticlesColor === 'string'? 
        /**
         * Its a bug in this library, so if a string is provided
         * pass it to the function to make it work.  
         */
        _ => properties.directionOptions?.directionalParticlesColor as string :
        properties.relationOptions?.color}
      linkCanvasObject={(link, ctx) => {
        let labelOptions: IRelationLabelOptions | undefined = undefined;
        if(link.label){
          labelOptions = {
            label: link.label,
            fontSize: properties.relationLabelOptions?.labelFontSize || defaultValues.linkLabelFontSize,
            backgroundColor: properties.relationLabelOptions?.labelBackgroundColor,
            color: properties.relationLabelOptions?.labelColor,
            font: properties.relationLabelOptions?.labelFont
          } 
        }
        const color = link.color || typeof properties.relationOptions?.color || defaultValues.linkColor;
        const width = link.width || typeof properties.relationOptions?.width || defaultValues.linkWidth;
        drawCurvedLine(ctx, {
          x: (link.source as NodeObject)?.x || 0,
          y: (link.source as NodeObject)?.y || 0,
        },
        {
          x: (link.target as NodeObject)?.x || 0,
          y: (link.target as NodeObject)?.y || 0,
        },
        properties.relationOptions?.curvature || defaultValues.curvature,
        color,
        width as number,
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
      }}
      /**
       * Follwoing Highlighting features works only with 2D
       * ----------------------------------------------
       * autoPauseRedraw={false}
       * nodeCanvasObjectMode={(node: NodeObject) => highlightNodes.has(node) ? 'before' : undefined}
       * nodeCanvasObject={paintRing}
       */
      onNodeHover={handleNodeHover}
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