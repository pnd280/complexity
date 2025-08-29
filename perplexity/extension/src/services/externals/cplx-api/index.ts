import { APP_CONFIG } from "@/app.config";
import { CplxApiOfflineService } from "@/services/externals/cplx-api/offline-service";
import { CplxApiOnlineService } from "@/services/externals/cplx-api/online-service";
import type { ICplxApiService } from "@/services/externals/cplx-api/types";

const createCplxApiService = (): ICplxApiService => {
  if (APP_CONFIG.CPLX_CDN_URL != null) {
    return new CplxApiOnlineService();
  }

  return new CplxApiOfflineService();
};

export const CplxApiService = createCplxApiService();
