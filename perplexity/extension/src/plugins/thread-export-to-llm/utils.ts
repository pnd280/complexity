import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import type { ThreadContext, ExportFormat, TargetLlm } from "@/plugins/thread-export-to-llm/types";
import { parseUrl } from "@/utils/misc/utils";

/**
 * Collects the full thread context including messages and metadata
 */
export async function collectThreadContext(): Promise<ThreadContext> {
  const messageBlocks =
    threadMessageBlocksDomObserverStore.getState().messageBlocks;

  if (!messageBlocks || messageBlocks.length === 0) {
    throw new Error("No message blocks found in the thread");
  }

  const messages = messageBlocks
    .map((block) => {
      const content = block.content;
      if (!content) return null;

      // Extract user query
      const userMessage = {
        role: "user" as const,
        content: content.title || "",
        timestamp: new Date().toISOString(),
      };

      // Extract assistant answer
      const assistantMessage = {
        role: "assistant" as const,
        content: content.answer || "",
        timestamp: new Date().toISOString(),
        attachments: content.webResults?.map((result) => result.url) || [],
      };

      return [userMessage, assistantMessage];
    })
    .filter((pair) => pair !== null)
    .flat();

  // Extract thread metadata
  const url = parseUrl();
  const threadId = url.pathname.split("/").pop() || "";
  const title =
    messageBlocks[0]?.content?.title || "Perplexity Thread Export";
  const model = messageBlocks[0]?.content?.displayModel || "unknown";

  const metadata = {
    threadId,
    title,
    createdAt: new Date().toISOString(),
    model,
    url: window.location.href,
  };

  return {
    messages,
    metadata,
  };
}

/**
 * Formats thread context as Markdown
 */
export function formatAsMarkdown(context: ThreadContext): string {
  const { messages, metadata } = context;

  let output = `# ${metadata.title}\n\n`;

  if (metadata) {
    output += `**Thread ID:** ${metadata.threadId}\n`;
    output += `**Model:** ${metadata.model}\n`;
    output += `**Created:** ${metadata.createdAt}\n`;
    output += `**URL:** ${metadata.url}\n\n`;
    output += `---\n\n`;
  }

  messages.forEach((message, index) => {
    const roleLabel = message.role === "user" ? "**User**" : "**Assistant**";
    output += `${roleLabel}:\n\n${message.content}\n\n`;

    if (message.attachments && message.attachments.length > 0) {
      output += `*Sources:*\n`;
      message.attachments.forEach((url, idx) => {
        output += `${idx + 1}. ${url}\n`;
      });
      output += `\n`;
    }

    if (index < messages.length - 1) {
      output += `---\n\n`;
    }
  });

  return output;
}

/**
 * Formats thread context as JSON
 */
export function formatAsJson(context: ThreadContext): string {
  return JSON.stringify(context, null, 2);
}

/**
 * Formats thread context as plain text
 */
export function formatAsPlaintext(context: ThreadContext): string {
  const { messages, metadata } = context;

  let output = `${metadata.title}\n\n`;

  if (metadata) {
    output += `Thread ID: ${metadata.threadId}\n`;
    output += `Model: ${metadata.model}\n`;
    output += `Created: ${metadata.createdAt}\n`;
    output += `URL: ${metadata.url}\n\n`;
    output += `${"=".repeat(80)}\n\n`;
  }

  messages.forEach((message, index) => {
    const roleLabel = message.role === "user" ? "User" : "Assistant";
    output += `${roleLabel}:\n${message.content}\n\n`;

    if (message.attachments && message.attachments.length > 0) {
      output += `Sources:\n`;
      message.attachments.forEach((url, idx) => {
        output += `${idx + 1}. ${url}\n`;
      });
      output += `\n`;
    }

    if (index < messages.length - 1) {
      output += `${"-".repeat(80)}\n\n`;
    }
  });

  return output;
}

/**
 * Formats thread context based on the specified format
 */
export function formatThreadContext(
  context: ThreadContext,
  format: ExportFormat,
): string {
  switch (format) {
    case "markdown":
      return formatAsMarkdown(context);
    case "json":
      return formatAsJson(context);
    case "plaintext":
      return formatAsPlaintext(context);
    default:
      return formatAsMarkdown(context);
  }
}

/**
 * Copies content to clipboard
 */
export async function exportToClipboard(content: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    // Fallback method for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = content;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Opens the target LLM in a new tab
 */
export function openInTargetLlm(
  targetLlm: TargetLlm,
  customEndpoint?: string,
): void {
  const urls: Record<TargetLlm, string> = {
    "ai-studio": "https://aistudio.google.com/app/prompts/new",
    claude: "https://claude.ai/new",
    chatgpt: "https://chat.openai.com/",
    custom: customEndpoint || "",
  };

  const url = urls[targetLlm];
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
