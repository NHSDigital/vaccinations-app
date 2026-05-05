/**
 * Handles the creation and injection of various UI components into the Splunk page,
 * such as the toggle button and the graph/info display panels.
 */
export function injectToggleButton() {
  const toggleButton = document.createElement("button");
  toggleButton.innerHTML = "Graph View [ Open ]";
  toggleButton.style.cssText = `
    position: fixed;
    background: #111;
    color: #f2f4f5;
    top: 0;
    left: 50vw;
    padding: 10px 20px;
    border: 0.2vw solid #ff9193;
    border-radius: 0.5vw;
    z-index: 99999;
  `;
  document.body.appendChild(toggleButton);
  return toggleButton;
}

export function injectGraphPanel() {
  const panel = document.createElement("div");
  panel.id = "splunk-graph-panel";
  panel.style.cssText = `
    position: fixed;
    background: #fff;
    display: none;
    top: 0;
    left: 0;
    width: 70vw;
    height: 100vh;
    border: 0.2vw solid #a39193;
    border-radius: 0.5vw;
    z-index: 9999;
  `;
  document.body.appendChild(panel);
  return panel;
}

export function injectDevicesPanel() {
  const panel = document.createElement("div");
  panel.id = "device-display";
  panel.style.cssText = `
    position: fixed;
    display: none;
    width: 35vw;
    min-height: 10vh;
    max-height: 40vh;
    right: 0;
    bottom: 1vw;
    padding: 0.5vw;
    margin: 0;
    background: #f6e0b5;
    overflow: auto;
    border: 0.15vw solid #a39193;
    border-radius: 0.5vw;
    z-index: 9999;
  `;
  document.body.appendChild(panel);
  panel.appendChild(document.createElement("h3")).innerText = "Device Information";
  return panel;
}

export function injectLogviewPanel() {
  const panel = document.createElement("div");
  panel.id = "info-display";
  panel.style.cssText = `
    position: fixed;
    display: none;
    width: 35vw;
    min-height: 50vh;
    max-height: 40vh;
    right: 0;
    top: 1vw;
    padding: 0.5vw;
    margin: 0;
    background: #f6e0b5;
    overflow: auto;
    border: 0.15vw solid #a39193;
    border-radius: 0.5vw;
    z-index: 9999;
  `;
  document.body.appendChild(panel);
  panel.appendChild(document.createElement("h3")).innerText = "Select a node to see the corresponding log event.";
  return panel;
}
