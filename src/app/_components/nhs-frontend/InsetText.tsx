interface InsetTextProps {
  content: string;
}

const InsetText = (props: InsetTextProps) => {
  return (
    <div className="nhsuk-inset-text">
      <span className="nhsuk-u-visually-hidden">Information: </span>
      <div dangerouslySetInnerHTML={{ __html: props.content }} />
    </div>
  );
};

export default InsetText;
