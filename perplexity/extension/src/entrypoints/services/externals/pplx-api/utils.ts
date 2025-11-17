import type { Socket } from "socket.io-client";

import { ENDPOINTS } from "@/entrypoints/services/externals/pplx-api/endpoints";

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
  socketInstance: Socket,
) {
  try {
    await socketInstance.emitWithAck("save_user_settings", settings);
    return true;
  } catch (e) {
    console.error("Failed to save setting", e);
    return false;
  }
}
