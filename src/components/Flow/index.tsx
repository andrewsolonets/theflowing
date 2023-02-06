import { useCallback, useState } from "react";
import type { Node, Connection, Edge } from "reactflow";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  ConnectionLineType,
  Background,
  Panel,
} from "reactflow";
import CustomNode from "./CustomNode";
import Parallelogram from "./Shapes/Parallelogram";

const defaultNodeStyle = {
  border: "2px solid #ff0071",
  background: "white",
  borderRadius: 20,
};
const rectNodeStyle = {
  border: "2px solid #ff0071",
  background: "white",
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
    style: rectNodeStyle,
  },
  {
    id: "2",
    data: { label: "Node 2" },
    position: { x: 100, y: 100 },
    style: defaultNodeStyle,
  },
  {
    id: "3",
    data: { label: "Node 3" },
    position: { x: 400, y: 100 },
    type: "custom",
    style: defaultNodeStyle,
    className: "px-8 py-2 rounded-full",
  },

  {
    id: "4",
    data: { label: "Node 4" },
    position: { x: 400, y: 200 },
    type: "custom",
    style: defaultNodeStyle,
    className: "px-8 py-2 rounded-full",
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = {
  custom: CustomNode,
  prl: Parallelogram,
};

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className=" h-screen w-screen flex-grow text-xs">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="bottom-center">
          <button
            onClick={() =>
              setNodes((prev) => {
                console.log(prev);
                return [
                  ...prev,
                  {
                    id: "5",
                    data: { label: "Node 5" },
                    position: { x: 250, y: 200 },
                    type: "custom",
                    style: defaultNodeStyle,
                    className: "px-8 py-2 rounded-full",
                  },
                ];
              })
            }
          >
            Test
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default Flow;
