// "use client";
// import React, { useCallback, useMemo } from "react";
// import {
//   ReactFlow,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
// } from "reactflow";
// import "reactflow/dist/style.css";

// import PigeonNode from "./PigeonNode";
// import { pigeonEdges, pigeonNodes } from "./PigeonData";

// const nodeTypes = {
//   pigeonNode: PigeonNode,
// };

// export default function PigeonPedigreeChart() {
//   // Calculate proper positions for left-to-right layout with proper spacing
//   const repositionedNodes = useMemo(() => {
//     const generations = {};
    
//     // Group nodes by generation
//     pigeonNodes.forEach(node => {
//       if (!generations[node.data.generation]) {
//         generations[node.data.generation] = [];
//       }
//       generations[node.data.generation].push(node);
//     });

//     // Calculate positions for each generation
//     const updatedNodes = [];
//     const generationSpacing = 400; // Horizontal spacing between generations
//     const baseVerticalSpacing = {
//       0: 0,    // Subject - centered
//       1: 250,  // Parents - spaced vertically
//       2: 150,  // Grandparents - closer spacing
//       3: 100,  // Great-grandparents - even closer
//       4: 80    // Great-great-grandparents - tightest spacing
//     };

//     Object.keys(generations).forEach(gen => {
//       const generation = parseInt(gen);
//       const nodesInGen = generations[generation];
//       const nodeCount = nodesInGen.length;
//       const verticalSpacing = baseVerticalSpacing[generation];
      
//       // Calculate starting Y position to center the generation vertically
//       const totalHeight = (nodeCount - 1) * verticalSpacing;
//       const startY = 500 - (totalHeight / 2); // 500 is center point
      
//       nodesInGen.forEach((node, index) => {
//         const newNode = {
//           ...node,
//           position: {
//             x: generation * generationSpacing + 50, // Left to right positioning
//             y: startY + (index * verticalSpacing)
//           }
//         };
//         updatedNodes.push(newNode);
//       });
//     });

//     return updatedNodes;
//   }, []);

//   // React Flow hooks
//   const [nodes, setNodes, onNodesChange] = useNodesState(repositionedNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(pigeonEdges);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const defaultViewport = { x: 0, y: 0, zoom: 0.6 };

//   return (
//     <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-10">

      
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         nodeTypes={nodeTypes}
//         defaultViewport={defaultViewport}
//         fitView
//         attributionPosition="bottom-right"
//         className="bg-transparent"
//         minZoom={0.3}
//         maxZoom={1.2}
//         nodesDraggable={false}
//         nodesConnectable={false}
//         elementsSelectable={true}
//         panOnDrag={true}
//         zoomOnScroll={true}
//         zoomOnPinch={true}
//         zoomOnDoubleClick={false}
//       >
//         <Background variant="dots" gap={25} size={1.5} color="#cbd5e1" />
//       </ReactFlow>
//     </div>
//   );
// }