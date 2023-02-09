/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useCallback, useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import type { Node, Connection, Edge } from "reactflow";
import { useEdges } from "reactflow";
import { useReactFlow } from "reactflow";
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
import { api } from "../../utils/api";
import type { UserData } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";
import EditableTitle from "../EditableTitle";

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

function Flow({ dataInit }: { dataInit: UserData }) {
  const [name, setName] = useState("Untitled");
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  const dataMutation = api.flow.postUserData.useMutation();
  const updMutation = api.flow.updateFlow.useMutation();
  const { data } = api.flow.getUserFlows.useQuery();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  console.log(nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const edges1 = useEdges();
  console.log(dataInit);

  useEffect(() => {
    if (dataInit && dataInit?.nodes && dataInit?.edges) {
      //@ts-expect-error
      setNodes(JSON.parse(dataInit.nodes));
      //@ts-expect-error
      setEdges(JSON.parse(dataInit.edges));
    } else if (id === "new") {
      console.log("new");
    }
    if (dataInit?.name) {
      setName(dataInit.name);
    }
  }, [dataInit, setEdges, setNodes, id]);

  useEffect(() => {
    console.log(edges1);
  }, [edges1]);

  const getFlow = () => {
    if (data && data?.at(-1) && data?.at(-1)?.nodes && data.at(-1)?.edges) {
      console.log("get attempt");
      console.log(data.at(-1));
      //@ts-expect-error
      setNodes(JSON.parse(data.at(-1).nodes as string));
      //@ts-expect-error
      setEdges(JSON.parse(data.at(-1).edges as string));
    }
  };

  const instance = useReactFlow();
  const nodesJson = JSON.stringify(instance.getNodes());
  const edgesJson = JSON.stringify(instance.getEdges());
  console.log(edgesJson);

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
        <Panel position="bottom-center" className="flex gap-2">
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

          {/* <button onClick={() => getFlow()}>Get data</button> */}
        </Panel>
        <Panel position="top-left" className="flex items-center gap-2">
          <Link
            href={"/"}
            className="outline-amber  w-max rounded-sm bg-transparent px-3 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-amber-400/20 hover:bg-opacity-10 md:px-4"
          >
            Back
          </Link>
          <EditableTitle name={name} setName={setName} className="text-xl" />
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <button
            className="outline-amber  w-max rounded-sm bg-transparent px-3 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-amber-400/20 hover:bg-opacity-10 md:px-4"
            onClick={() => {
              if (dataInit) {
                updMutation.mutate({
                  //@ts-expect-error
                  id,
                  name,
                  nodes: nodesJson,
                  edges: edgesJson,
                });
              } else if (userId) {
                dataMutation.mutate({
                  userId,
                  name,
                  nodes: nodesJson,
                  edges: edgesJson,
                });
              }
            }}
          >
            Save
          </button>
          <button
            className="outline-amber  w-max rounded-sm bg-transparent px-3 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-amber-400/20 hover:bg-opacity-10 md:px-4"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={sessionData ? () => signOut() : () => signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default Flow;
