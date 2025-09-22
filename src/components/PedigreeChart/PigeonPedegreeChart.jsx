// "use client";

// import React, { useCallback } from "react";
// import {
//   ReactFlow,
//   useNodesState,
//   useEdgesState,
//   addEdge,
//   Handle,
//   Position,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { User, Calendar, Crown, Award, Info } from "lucide-react";
// import { initialEdges, initialNodes } from "./PigeonData";
// // import { initialEdges, initialNodes } from "@/data/pedigree-chart-data";

// // // Custom Node Component for Pigeon Pedigree
// const PigeonNode = ({ data }) => {
//   console.log(data.color);
//   const getGenderIcon = (gender) => {
//     return gender === "male" ? "♂" : "♀";
//   };

//   const getGenderColor = (gender) => {
//     return gender === "male" ? "bg-blue-500" : "bg-pink-500";
//   };

//   const getGenerationColor = (generation) => {
//     switch (generation) {
//       case 0:
//         return "border-black"; // Subject
//       case 1:
//         return "border-black"; // Parents (2)
//       case 2:
//         return "border-black"; // Grandparents (4)
//       case 3:
//         return "border-black"; // Great-grandparents (8)
//       case 4:
//         return "border-black"; // Great-great-grandparents (16)
//       default:
//         return "border-black";
//     }
//   };

//   const getCardSize = (generation) => {
//     switch (generation) {
//       case 0:
//         return "w-[300px] h-[700px]"; // Subject - largest
//       case 1:
//         return "w-[300px] h-[700px]"; // Parents
//       case 2:
//         return "w-[300px] h-[400px]"; // Grandparents
//       case 3:
//         return "w-[300px] h-[200px]"; // Great-grandparents
//       case 4:
//         return "w-[300px] h-[100px]"; // Great-great-grandparents - smallest
//       default:
//         return "w-[300px] h-24";
//     }
//   };

//   return (
//     <div
//       style={{ backgroundColor: data.color }}
//       className={`${getCardSize(data?.generation)} 
            
//             border-b-8 border-r-10 border-black
//               text-white rounded-none transition-all duration-300 
//               ${getGenerationColor(data?.generation)} border`}
//     >
//       <Handle
//         type="target"
//         position={Position.Left}
//         className="w-3 h-3 !bg-slate-400"
//       />
//       <div className="flex items-center justify-between px-3">
//         <span variant="outline" className="text-xs px-1 text-black">
//           Gen {data.generation}
//         </span>
       
//            <Crown className="w-3 h-3 text-amber-600" />
//               <span
//             className={`${getGenderColor(
//               data.gender
//             )} text-black text-xs px-1 py-0.5`}
//           >
//             {getGenderIcon(data.gender)}
//           </span>
//       </div>
//       <CardHeader className="pb-2 ">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
           
//             <h3 className="font-bold text-black text-xl truncate">
//               {data.name}
//             </h3>
//           </div>
//         <span variant="secondary" className="text-xs px-1 text-black">
//             {data.position}
//           </span>
//         </div>

//         <div className="flex items-center justify-between">
          
//         </div>
//       </CardHeader>

//       <CardContent className="pt-0 p-3">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2 text-xs text-gray-600">
//             <User className="w-3 h-3" />
//             <span className="truncate">{data.owner}</span>
//           </div>

//           <div className="flex items-center gap-2 text-xs text-gray-600">
//             <Calendar className="w-3 h-3" />
//             <span>{data.birthYear}</span>
//           </div>

//           <div className="flex items-center gap-2 text-xs text-gray-600">
//             <div className={`w-3 h-3 rounded-full ${data.color}`}></div>
//             <span className="truncate">{data.colorName}</span>
//           </div>

//           <Dialog>
//             <DialogTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-5 w-full text-xs mt-1 p-0"
//               >
//                 <Info className="w-3 h-3 mr-1" />
//                 View Details
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-md">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Crown className="w-4 h-4 text-amber-600" />
//                   {data.name}
//                   <Badge
//                     className={`${getGenderColor(data.gender)} text-white`}
//                   >
//                     {getGenderIcon(data.gender)}
//                   </Badge>
//                 </DialogTitle>
//               </DialogHeader>

//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-semibold">Owner</p>
//                     <p className="text-xs text-gray-600">{data.owner}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold">Birth Year</p>
//                     <p className="text-xs text-gray-600">{data.birthYear}</p>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-sm font-semibold">Position</p>
//                   <p className="text-xs text-gray-600">{data.position}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm font-semibold">Color</p>
//                   <div className="flex items-center gap-2">
//                     <div className={`w-4 h-4 rounded-full ${data.color}`}></div>
//                     <p className="text-xs text-gray-600">{data.colorName}</p>
//                   </div>
//                 </div>

//                 {data.achievements && (
//                   <div>
//                     <div className="flex items-center gap-2 mb-2">
//                       <Award className="w-4 h-4 text-amber-600" />
//                       <p className="text-sm font-semibold">Achievements</p>
//                     </div>
//                     <p className="text-xs text-gray-600">{data.achievements}</p>
//                   </div>
//                 )}

//                 <div className="bg-slate-50 p-3 rounded-lg">
//                   <p className="text-sm text-slate-700">{data.description}</p>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </CardContent>

//       <Handle
//         type="source"
//         position={Position.Right}
//         className="w-3 h-3 !bg-slate-400"
//       />
//     </div>
//   );
// };

// const nodeTypes = {
//   pigeonNode: PigeonNode,
// };

// export default function PigeonPedigreeChart() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const defaultViewport = { x: 0, y: 0, zoom: 0.8 };

//   return (
//     <div className="w-full h-[1800px] flex justify-start items-center ">
//       {/* --- ReactFlow (static) --- */}
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
//         className="bg-transparent h-full py-16"
//         minZoom={0.5}
//         maxZoom={1}
//         nodesDraggable={false}
//         nodesConnectable={false}
//         elementsSelectable={false}
//         panOnDrag={false}
//         zoomOnScroll={false}
//         zoomOnPinch={false}
//         zoomOnDoubleClick={false}
//       >
//         {/* <Background variant="dots" gap={25} size={1.5} color="#FFFFFF" /> */}
//       </ReactFlow>
//     </div>
//   );
// }
