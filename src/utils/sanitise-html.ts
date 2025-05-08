import DOMPurify from "isomorphic-dompurify";

const convertLinksToOpenExternally = (node: Element) => {
  if (node.tagName.toUpperCase() === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener");
  }
};

DOMPurify.addHook("afterSanitizeAttributes", function (node: Element) {
  convertLinksToOpenExternally(node);
});

const sanitiseHtml = (dirty: string) => {
  return DOMPurify.sanitize(dirty);
};

export default sanitiseHtml;
