/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import type { Node, ReactFlowInstance } from "reactflow";

type MyProps = {
  // using `interface` is also ok
  isOpen: boolean;
  instance: ReactFlowInstance<any, any>;
  node: Node<any, string | undefined> | undefined;
};

const EditableText: FC<MyProps> = ({ isOpen, instance, node }) => {
  const [state, setState] = useState("Edit");
  const contentEditable = useRef();

  useEffect(() => {
    setState(node?.data.label as string);
  }, [node]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (evt: any) => {
    console.log(evt);
    setState(evt.target.value as string);
    instance.setNodes((prev) => {
      const otherNodes = prev.filter((el) => el.id !== node?.id);
      return [
        ...otherNodes,
        {
          ...(node as Node),
          data: { label: evt.target.value as string },
        },
      ];
    });
  };

  return (
    <ContentEditable
      onClick={(e) => {
        console.log(e);
      }}
      innerRef={contentEditable.current}
      className="z-[999] min-w-[10px] outline-none"
      html={state} // innerHTML of the editable div
      disabled={isOpen} // use true to disable edition
      onChange={handleChange} // handle innerHTML change
    />
  );
};

export default EditableText;
