export interface ThreadMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface ThreadMetadata {
  threadId: string;
  title: string;
  createdAt: string;
  model: string;
  url: string;
}

export interface ThreadContext {
  messages: ThreadMessage[];
  metadata: ThreadMetadata;
}

export type ExportFormat = "json" | "markdown" | "plaintext";
export type TargetLlm = "ai-studio" | "claude" | "chatgpt" | "custom";
