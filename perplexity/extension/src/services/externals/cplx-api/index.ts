import { APP_CONFIG } from "@/app.config";
import { CplxApiOfflineService } from "@/services/externals/cplx-api/offline-service";
import { CplxApiOnlineService } from "@/services/externals/cplx-api/online-service";

export const CplxApiService: typeof CplxApiOnlineService =
  APP_CONFIG.CPLX_CDN_URL != null
    ? CplxApiOnlineService
    : CplxApiOfflineService;
