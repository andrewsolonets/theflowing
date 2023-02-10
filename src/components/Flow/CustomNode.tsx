/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FC, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { memo } from "react";
import type { NodeProps } from "reactflow";
import { useReactFlow } from "reactflow";
import { NodeToolbar } from "reactflow";
import { Handle, Position } from "reactflow";
import EditableText from "../EditableText";
import uuid from "react-uuid";
import { useMainCtx } from "../../context/MainCtx";

const CustomNode: FC<NodeProps> = ({ data, id }) => {
  const instance = useReactFlow();
  // const inputRef = useRef<HTMLInputElement>(null);
  // const [label, setLabel] = useState(data.label as string);
  const { color, setColorOpen } = useMainCtx();
  const node = instance.getNode(id);
  console.log(node);

  // useLayoutEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.style.width = `${data.label.length * 6.5}px`;
  //   }
  // }, [data.label.length]);

  return (
    <>
      <Handle type="target" position={Position.Top} id="l" />

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
        <button
          onClick={() => {
            if (node) {
              instance.addNodes({ ...node, id: uuid() });
            }
          }}
        >
          copy
        </button>
        <button
          onClick={() => {
            if (node) {
              setColorOpen(node.id);
            }
          }}
        >
          change color
        </button>
      </NodeToolbar>
      {/* 
      <input
        type="text"
        value={data.label}
        ref={inputRef}
        className="bg-transparent text-center outline-none "
        //@ts-expect-error
        disabled={!node.selected}
        onChange={(e) => {
          setLabel(e.target.value);
          //@ts-expect-error
          instance.setNodes((prev) => {
            const otherNodes = prev.filter((el) => el.id !== node?.id);
            return [
              ...otherNodes,
              {
                ...(node as Node),
                data: { label: e.target.value },
              },
            ];
          });
        }}
      /> */}

      <EditableText isOpen={false} instance={instance} node={node} />

      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="target" position={Position.Left} id="n" />
      <Handle type="source" position={Position.Right} id="c" />
    </>
  );
};

export default memo(CustomNode);
