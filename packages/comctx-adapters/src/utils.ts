export function buildDestination({
  context,
  tabId,
  frameId,
}: {
  context: string;
  tabId?: number;
  frameId?: number;
}): string {
  if (tabId == null || isNaN(tabId)) {
    return context;
  }

  if (frameId == null && tabId != null) {
    return `${context}@${tabId}`;
  }

  return `${context}@${tabId}.${frameId}`;
}
