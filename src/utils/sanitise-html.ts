import DOMPurify from "isomorphic-dompurify";

const sanitiseHtml = (dirty: string) => {
  return { __html: DOMPurify.sanitize(dirty) };
};

export default sanitiseHtml;
