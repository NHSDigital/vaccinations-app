/**
 * Renders the interactive graph using the vis-network library.
 * Also, handles node click events to display detailed log information.
 */
import { LogNode } from "@src/types/logs";
import renderjson from "renderjson-2";
import { DataSet } from "vis-data";
import { Network } from "vis-network";

export function renderGraph(container: HTMLElement, graph: { nodes: LogNode[]; edges }) {
  renderjson.set_show_to_level(1);

  const nodes = new DataSet(
    graph.nodes.map((n) => {
      if (n.device) {
        const deviceJson = renderjson(n.device);
        document.getElementById("device-display")?.appendChild(deviceJson);
      }

      return {
        id: n.id,
        label: n.label,
        title: n.context || n.label,
        color: n.color,
        font: n.font,
        shape: n.shape,
        margin: { top: 10, right: 20, bottom: 10, left: 20 },
        info: n.info,
        size: n.size,
      };
    }),
  );
  const edges = new DataSet(graph.edges.map((e) => ({ from: e.from, to: e.to, label: e.label })));

  const options = {
    physics: {
      enabled: true,
      solver: "repulsion",
      repulsion: {
        nodeDistance: 200, // Increase/Decrease spacing
        centralGravity: 0.2,
        springLength: 80,
        springConstant: 0.05,
      },
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 0.5 } },
      smooth: { enabled: true, type: "dynamic", roundness: 0.5 },
    },
  };

  const network = new Network(container, { nodes, edges }, options);
  network.on("click", function (params) {
    renderjson.set_show_to_level(4);

    // Check if a node was actually clicked (params.nodes is an array of IDs)
    const infoDisplay = document.getElementById("info-display");
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0]; // Get the ID of the clicked node
      const nodeData = nodes.get(nodeId); // Retrieve the full object from the DataSet

      // Show content in a div
      const heading = document.createElement("h3");
      heading.innerText = "Event Details";
      infoDisplay?.replaceChildren(heading, renderjson(nodeData.info));
    } else {
      // Optional: Clear the div if clicking on the background
      if (infoDisplay) infoDisplay.innerHTML = "<h3>Select a node to see the corresponding log event.</h3>";
    }
  });
}
