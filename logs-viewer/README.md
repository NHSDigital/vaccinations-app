# Splunk Logs Graph Viewer

A Chrome extension that renders Splunk logs as an interactive graph, making it easier to visualize log flows and session traces.

## Features
- **Interactive Graph**: Visualizes logs as nodes and edges.
- **Session Grouping**: Automatically groups logs by `sessionId`, `traceId`, or `requestId`.
- **Latency Tracking**: Shows latency between consecutive log entries.
- **Device Detection**: Identifies devices and platforms from user-agent headers in logs.
- **Log Inspection**: Click on nodes to view detailed log data.

## How to Build
To build the extension from source, ensure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Build the project**:
    ```bash
    npm run build
    ```
    This will generate a `dist/` directory containing the compiled extension.

## How to Install (Chrome Extension)
1.  Open Chrome and navigate to `chrome://extensions/`.
2.  Enable **Developer mode** using the toggle in the top right corner.
3.  Click the **Load unpacked** button.
4.  Select the `logs-viewer/` folder.

## How to Use (Chrome)
1.  Navigate to your Splunk instance (configured for `https://nhsdigital.splunkcloud.com/*`).
2.  Perform a search that returns logs in the expected JSON format.
3.  A **"Graph View [ Open ]"** button will appear on the page.
4.  Click the button to generate and view the interactive graph.

## How to Run Locally (CLI)
If you have a log file in JSON format (downloaded from Splunk), you can process and view it locally without installing the extension:

1.  **Prepare your logs**: Ensure you have a log file (e.g., `logs.json`).
2.  **Process and start server**:
    ```bash
    ./process-and-view-cli.sh logs.json
    ```
3.  **View the graph**: Open the URL displayed in the terminal ( `http://localhost:8080` ).
