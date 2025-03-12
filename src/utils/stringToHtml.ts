import DOMPurify from "isomorphic-dompurify";

const stringToHtml = (dirty: string) => {
  return { __html: DOMPurify.sanitize(dirty) };
};

export default stringToHtml;
