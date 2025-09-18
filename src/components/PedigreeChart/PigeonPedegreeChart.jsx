"use client";

// PigeonPedigreeChart.jsx - মূল চার্ট কম্পোনেন্ট

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";


import PigeonNode from "./PigeonNode";
import { pigeonNodes, pigeonEdges } from "./pigeonData";


const nodeTypes = {
  pigeonNode: PigeonNode,
};

export default function PigeonPedigreeChart() {
  // React Flow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(pigeonNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(pigeonEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const defaultViewport = { x: 0, y: 0, zoom: 0.5 };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-right"
        className="bg-transparent"
        minZoom={0.5} 
        maxZoom={1} 
        nodesDraggable={false} 
        nodesConnectable={false} 
        elementsSelectable={false} 
        panOnDrag={false} 
        zoomOnScroll={false} 
        zoomOnPinch={false} 
        zoomOnDoubleClick={false} 
      >
        <Background variant="dots" gap={25} size={1.5} color="#cbd5e1" />
      </ReactFlow>
    </div>
  );
}