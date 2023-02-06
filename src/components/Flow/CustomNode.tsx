/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { FC } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { useReactFlow } from "reactflow";
import { NodeToolbar } from "reactflow";
import { Handle, Position } from "reactflow";
import EditableText from "../EditableText";

const CustomNode: FC<NodeProps> = ({ data, id }) => {
  const instance = useReactFlow();
  const node = instance.getNode(id);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <NodeToolbar
          isVisible={data.toolbarVisible}
          position={data.toolbarPosition}
          className="flex gap-2 text-lg"
        >
          <button
            onClick={() => {
              if (node) {
                console.log(
                  instance.deleteElements({ nodes: [node], edges: [] })
                );
              }
            }}
          >
            delete
          </button>
          <button>copy</button>
          <button>expand</button>
        </NodeToolbar>
        <div className="relative">
          <EditableText isOpen={false} />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="target" position={Position.Left} id="b" />
      <Handle type="source" position={Position.Right} id="c" />
    </>
  );
};

export default memo(CustomNode);