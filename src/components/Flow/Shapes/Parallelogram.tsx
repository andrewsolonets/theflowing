/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { FC } from "react";
import { memo } from "react";
import { useCallback } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";

const Parallelogram: FC<NodeProps> = ({ data }) => {
  return (
    <div className=" h-14 w-[100px]  ">
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text: {data.label}</label>
        {/* <input id="text" name="text" onChange={onChange} /> */}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default memo(Parallelogram);
