import { JSX } from "react";

interface InsetTextProps {
  content: JSX.Element;
}

const InsetText = (props: InsetTextProps) => {
  return (
    <div className="nhsuk-inset-text">
      <span className="nhsuk-u-visually-hidden">Information: </span>
      {props.content}
    </div>
  );
};

export default InsetText;
