/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type { Dispatch, SetStateAction } from "react";
import { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

const EditableTitle = ({
  name,
  setName,
  className,
}: {
  setName: Dispatch<SetStateAction<string>>;
  name: string;
  className: string;
}) => {
  const contentEditable = useRef();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (evt: any) => {
    console.log(evt);
    setName(evt.target.value as string);
  };

  return (
    <ContentEditable
      innerRef={contentEditable.current}
      className={`min-w-[10px]  outline-none ${className}`}
      html={name} // innerHTML of the editable div
      onChange={handleChange} // handle innerHTML change
    />
  );
};

export default EditableTitle;
