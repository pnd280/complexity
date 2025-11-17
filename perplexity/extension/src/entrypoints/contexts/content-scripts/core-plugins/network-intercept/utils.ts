export function isValidWebSocket(instance: WebSocket | null) {
  return instance?.readyState === WebSocket.OPEN;
}
