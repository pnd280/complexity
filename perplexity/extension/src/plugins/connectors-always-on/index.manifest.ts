import { z } from "zod";

import { definePlugin } from "@/__registries__/plugins/utils";

declare module "@/__registries__/plugins/meta.types" {
  interface PluginsSettingsRegistry {
    connectorsAlwaysOn: z.infer<typeof schema>;
  }
}

// Known connector IDs (found in Perplexity source):
//
// Basic Sources:
// - "web" - Web search (default)
// - "academic" - Academic sources
// - "reddit" - Reddit
// - "youtube" - YouTube
// - "writing" - Writing mode
// - "social" - Social media
// - "edgar" - SEC EDGAR filings
//
// MCP Connectors (Model Context Protocol):
// - "github_mcp_direct" - GitHub MCP (default in this plugin)
// - "notion" - Notion
// - "notion_mcp" - Notion MCP
// - "linear" - Linear
// - "linear_alt" - Linear (alternative)
// - "slack" - Slack
// - "slack_direct" - Slack Direct
// - "google_drive" - Google Drive
// - "asana_mcp_direct" - Asana MCP
// - "asana_mcp_merge" - Asana MCP (merge)
// - "atlassian_mcp_direct" - Atlassian/Jira/Confluence
// - "confluence_mcp_merge" - Confluence MCP (merge)
// - "jira_mcp_merge" - Jira MCP (merge)
// - "microsoft_teams_mcp_merge" - Microsoft Teams MCP
//
// Premium/Enterprise:
// - "cbinsights_mcp_cashmere" - CB Insights
// - "pitchbook_mcp_cashmere" - PitchBook
// - "statista_mcp_cashmere" - Statista
// - "wiley_mcp_cashmere" - Wiley

const schema = z.object({
  enabled: z.boolean(),
  connectors: z.array(z.string()).default(["github_mcp_direct"]),
});

export default definePlugin({
  meta: {
    id: "connectorsAlwaysOn",
    title: "Connectors Always On",
    description:
      "Automatically enables selected connectors on page load (does not affect Spaces)",
    dashboardMeta: {
      tags: ["new"],
      categories: ["featured", "queryBox"],
      uiRouteSegment: "connectors-always-on",
    },
    dependencies: {
      corePlugins: ["spaRouter", "domObservers:internalSearchStates"],
    },
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: true,
      connectors: ["github_mcp_direct"], // GitHub MCP always enabled by default
    },
  },
});
