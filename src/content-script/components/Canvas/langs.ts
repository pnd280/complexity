// this constant is shared between main world and content script context, so it shouldn't be in a tsx file
// https://github.com/vitejs/vite-plugin-react/issues/11#discussion_r430879201

export const canvasLangs = [
  {
    title: "Charts & Diagrams",
    pplxSearch: "Mermaid Diagramming and charting tool",
    trigger: "mermaid",
    description:
      "Flowcharts, Sequence Diagrams, Gantt Charts, Class Diagrams, State Diagrams, Entity Relationship Diagrams, User Journey Diagrams, Pie Charts, Requirement Diagrams, Gitgraph Diagrams, etc.",
  },
  {
    title: "Webpages",
    pplxSearch: "",
    trigger: "html",
    description: "JavaScript is enabled.",
  },
] as const;
