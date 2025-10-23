import React from 'react';
import { Handle, Position } from 'reactflow';

const PigeonNode = ({ data }) => {
  // Check if this is the subject node (generation 0)
  const isSubject = data.generation === 0;

  return (
    <div className="pigeon-node" style={{ 
      backgroundColor: data.color || '#fff',
      border: '2px solid #333',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '200px'
    }}>
      {/* Conditional Handles based on generation */}
      {isSubject ? (
        // Subject node: Top and Bottom handles
        <>
          <Handle
            type="source"
            position={Position.Top}
            id="top"
            className="w-3 h-3 !bg-slate-400"
            style={{ top: -6 }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className="w-3 h-3 !bg-slate-400"
            style={{ bottom: -6 }}
          />
          {/* Target handle for subject if needed */}
          <Handle
            type="target"
            position={Position.Left}
            className="w-3 h-3 !bg-slate-400"
            style={{ left: -6 }}
          />
        </>
      ) : (
        // All other nodes: Right center handle (source) and Left center handle (target)
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="w-3 h-3 !bg-slate-400"
            style={{ left: -6 }}
          />
          <Handle
            type="source"
            position={Position.Right}
            className="w-3 h-3 !bg-slate-400"
            style={{ right: -6 }}
          />
        </>
      )}

      {/* Node Content */}
      {data.isEmpty ? (
        <div className="text-gray-400 text-center py-8">
          Empty Node
        </div>
      ) : (
        <div>
          <div className="font-bold text-lg">{data.name}</div>
          <div className="text-sm text-gray-600">{data.ringNumber}</div>
          <div className="text-xs mt-1">
            <div>{data.owner}</div>
            <div>{data.country}</div>
            <div>{data.gender} - {data.birthYear}</div>
          </div>
          {data.achievements && (
            <div className="text-xs mt-2 border-t pt-2">
              {data.achievements}
            </div>
          )}
          {data.verified && <span className="text-blue-500">✓</span>}
          {data.iconic && <span className="text-yellow-500">⭐</span>}
        </div>
      )}
    </div>
  );
};

export default PigeonNode;