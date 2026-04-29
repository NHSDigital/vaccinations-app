/**
 * Main entry point for the Splunk Logs Graph Viewer content script.
 * Initializes the UI toggle and coordinates log extraction, processing, and graph rendering.
 */
import { renderGraph } from "./graph";
import { buildGraph, buildTimeline, extractLogsFromDOM } from "./processor";
import { injectDevicesPanel, injectGraphPanel, injectLogviewPanel, injectToggleButton } from "./ui-panels";

(function init() {
  const toggleButton = injectToggleButton();

  const graphPanel = injectGraphPanel();
  const devicesPanel = injectDevicesPanel();
  const logviewPanel = injectLogviewPanel();

  toggleButton.onclick = () => {
    if (toggleButton.innerText.search("Open") >= 0) {
      toggleButton.innerText = "Graph View [Close]";

      graphPanel.style.display = "block";
      devicesPanel.style.display = "block";
      logviewPanel.style.display = "block";

      const logs = extractLogsFromDOM();
      const timeline = buildTimeline(logs);
      const graph = buildGraph(timeline);
      renderGraph(graphPanel, graph);
    } else {
      toggleButton.innerText = "Graph View [ Open ]";

      graphPanel.style.display = "none";
      devicesPanel.style.display = "none";
      logviewPanel.style.display = "none";
    }
  };
})();
