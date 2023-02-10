/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useCallback, useEffect, useRef, useState } from "react";
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
import uuid from "react-uuid";
import { toast } from "react-toastify";
import { useMainCtx } from "../../context/MainCtx";
import { HexColorPicker } from "react-colorful";

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
};

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
};

function Flow({ dataInit }: { dataInit: UserData | null }) {
  const flowRef = useRef<HTMLDivElement>(null);
  const reactFlowBounds = flowRef?.current?.getBoundingClientRect();
  const [name, setName] = useState("Untitled");

  const { setLocalData, color, setColor, colorOpen, setColorOpen } =
    useMainCtx();
  const [nodeCreate, setNodeCreate] = useState({ isCreating: false, type: "" });
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  const dataMutation = api.flow.postUserData.useMutation();

  const instance = useReactFlow();
  const nodesJson = JSON.stringify(instance.getNodes());
  const edgesJson = JSON.stringify(instance.getEdges());
  const viewPortJson = JSON.stringify(instance.getViewport());
  const { setViewport } = useReactFlow();

  const updMutation = api.flow.updateFlow.useMutation();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const edges1 = useEdges();
  const [mouse, setMouse] = useState({
    x: 500,
    y: 2000,
  });

  useEffect(() => {
    if (dataInit && dataInit?.nodes && dataInit?.edges && dataInit?.viewport) {
      //@ts-expect-error
      const { x, y, zoom } = JSON.parse(dataInit.viewport);
      //@ts-expect-error
      setNodes(JSON.parse(dataInit.nodes));
      //@ts-expect-error
      setEdges(JSON.parse(dataInit.edges));
      console.log(x, y, zoom);

      setViewport({ x, y, zoom });
    } else if (id === "new") {
      console.log("new");
    }

    if (dataInit?.name) {
      setName(dataInit.name);
    }
  }, [dataInit, setEdges, setNodes, id, setViewport]);

  useEffect(() => {
    console.log(edges1);
  }, [edges1]);

  return (
    <div
      className=" h-screen w-screen flex-grow overflow-hidden  text-xs"
      onMouseMove={(e) => {
        if (nodeCreate.isCreating) {
          setMouse({ x: e.clientX, y: e.clientY });
        }
      }}
    >
      {nodeCreate.isCreating && (
        <button
          onClick={() => {
            const position = instance.project({
              x: mouse.x - reactFlowBounds!.left - 40,
              y: mouse.y - reactFlowBounds!.top - 40,
            });
            // console.log();
            instance.addNodes({
              id: uuid(),
              data: { label: "Text" },
              position: position,
              type: "custom",

              style:
                nodeCreate.type === "round"
                  ? defaultNodeStyle
                  : nodeCreate.type === "rect"
                  ? rectNodeStyle
                  : defaultNodeStyle,
              className: `px-8 py-2 ${
                nodeCreate.type === "round" ? "rounded-full" : ""
              } `,
            });

            setMouse({
              x: reactFlowBounds!.width * 0.5,
              y: reactFlowBounds!.height * 0.8,
            });

            setNodeCreate({ isCreating: false, type: "" });
          }}
          className={`absolute z-[999] h-20 w-40 ${
            nodeCreate.type === "round" ? "rounded-full" : "rounded-sm"
          }  bg-violet-500`}
          style={{ left: mouse.x - 40, top: mouse.y - 40 }}
        ></button>
      )}
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        ref={flowRef}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Background />
        <Controls />
        {colorOpen ? (
          <Panel position="top-left" className="mt-20 flex flex-col gap-2">
            {" "}
            <HexColorPicker
              color={color}
              onChange={setColor}
              className="  z-[999]"
            />
            <button
              onClick={() => {
                const node = instance.getNode(colorOpen);
                if (node) {
                  instance.setNodes((prev) => {
                    const filtered = prev.filter((el) => el.id !== colorOpen);
                    return [
                      ...filtered,
                      {
                        ...node,
                        style: { ...node.style, border: `2px solid ${color}` },
                      },
                    ];
                  });
                  setColorOpen("");
                }
              }}
            >
              Change
            </button>
          </Panel>
        ) : null}
        <Panel position="bottom-center" className="flex gap-6">
          <button
            onClick={() => setNodeCreate({ isCreating: true, type: "rect" })}
            className="h-20 w-40 rounded-sm bg-violet-500 transition-all duration-300 hover:-translate-y-1"
          ></button>

          <button
            onClick={() => setNodeCreate({ isCreating: true, type: "round" })}
            className="h-20 w-40 rounded-full bg-violet-500 transition-all duration-300 hover:-translate-y-1"
          ></button>

          {/* <button onClick={() => getFlow()}>Get data</button> */}
        </Panel>
        <Panel position="top-left" className="flex items-center gap-2">
          <Link
            href={"/"}
            className="outline-violet  w-max rounded-sm bg-transparent px-3 py-1 text-violet-400 outline outline-2 transition-all duration-300 hover:bg-violet-400/20 hover:bg-opacity-10 md:px-4"
          >
            Back
          </Link>
          <EditableTitle name={name} setName={setName} className="text-xl" />
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <button
            className="outline-violet  w-max rounded-sm bg-transparent px-3 py-1 text-violet-400 outline outline-2 transition-all duration-300 hover:bg-violet-400/20 hover:bg-opacity-10 md:px-4"
            onClick={() => {
              if (dataInit && userId) {
                updMutation.mutate({
                  //@ts-expect-error
                  id,
                  name,
                  nodes: nodesJson,
                  edges: edgesJson,
                  viewport: viewPortJson,
                });
                toast.success("Flow saved!");
              } else if (userId && !dataInit) {
                dataMutation.mutate({
                  userId,
                  name,
                  nodes: nodesJson,
                  edges: edgesJson,
                  viewport: viewPortJson,
                });
                toast.success("Flow saved!");
              } else if (dataInit) {
                setLocalData((prev) => {
                  const filtered = prev.filter((el) => el.id !== dataInit.id);

                  return [
                    ...filtered,
                    {
                      ...dataInit,
                      name,
                      nodes: nodesJson,
                      edges: edgesJson,
                      viewport: viewPortJson,
                    },
                  ];
                });
                toast.success("Flow saved!");
              } else if (!dataInit) {
                setLocalData((prev) => [
                  ...prev,
                  {
                    id: uuid(),
                    userId: null,
                    name,
                    nodes: nodesJson,
                    edges: edgesJson,
                    viewport: viewPortJson,
                  },
                ]);
                toast.success("Flow saved!");
              }
            }}
          >
            Save
          </button>
          <button
            className="outline-violet  w-max rounded-sm bg-transparent px-3 py-1 text-violet-400 outline outline-2 transition-all duration-300 hover:bg-violet-400/20 hover:bg-opacity-10 md:px-4"
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
