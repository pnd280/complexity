import { internalWebSocketStore } from "@/plugins/_core/global-stores/index.public";
import { ENDPOINTS } from "@/services/pplx-api/endpoints";

export async function saveUserSettingsViaFetch(
  settings: Record<string, unknown>,
) {
  const resp = await fetch(ENDPOINTS.USER_SETTINGS.UPDATE, {
    method: "PUT",
    body: JSON.stringify({
      updated_settings: settings,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return resp.ok;
}

export async function saveUserSettingsViaWebSocket(
  settings: Record<string, unknown>,
) {
  try {
    await internalWebSocketStore
      .getState()
      .common?.emitWithAck("save_user_settings", settings);
    return true;
  } catch (e) {
    alert("Failed to save setting");
    return false;
  }
}
