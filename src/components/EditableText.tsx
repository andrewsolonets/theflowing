/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import ContentEditable from "react-contenteditable";

type MyProps = {
  // using `interface` is also ok
  isOpen: boolean;
};

type MyState = {
  // using `interface` is also ok
  html: string;
};

class EditableText extends React.Component<MyProps, MyState> {
  contentEditable: React.RefObject<HTMLElement>;
  constructor() {
    //@ts-expect-error
    super();
    this.contentEditable = React.createRef();
    this.state = { html: "Edit!" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange = (evt: any) => {
    console.log(evt);
    this.setState({ html: evt.target.value });
  };

  render = () => {
    return (
      <ContentEditable
        innerRef={this.contentEditable}
        className="min-w-[10px] outline-none"
        html={this.state.html} // innerHTML of the editable div
        disabled={this.props.isOpen} // use true to disable edition
        onChange={this.handleChange} // handle innerHTML change
      />
    );
  };
}

export default EditableText;
