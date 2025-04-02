import sanitiseHtml from "@src/utils/sanitise-html";

interface InsetTextProps {
  content: string;
}

const InsetText = (props: InsetTextProps) => {
  return (
    <div className="nhsuk-inset-text">
      <span className="nhsuk-u-visually-hidden">Information: </span>
      <div dangerouslySetInnerHTML={sanitiseHtml(props.content)} />
    </div>
  );
};

export default InsetText;
