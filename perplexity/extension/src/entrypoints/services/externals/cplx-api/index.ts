import { APP_CONFIG } from "@/app.config";
import { CplxApiOfflineService } from "@/entrypoints/services/externals/cplx-api/offline-service";
import { CplxApiOnlineService } from "@/entrypoints/services/externals/cplx-api/online-service";

export const CplxApiService: typeof CplxApiOnlineService =
  APP_CONFIG.CPLX_CDN_URL != null
    ? CplxApiOnlineService
    : CplxApiOfflineService;
