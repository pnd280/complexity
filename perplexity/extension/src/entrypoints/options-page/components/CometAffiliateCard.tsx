import { CometCard } from "@/components/CometCard";
import PplxComet from "@/components/icons/PplxComet";
import PplxPro from "@/components/icons/PplxPro";
import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import { cometAffiliateRemoteResourceConfig } from "@/services/externals/cplx-api/remote-resources/comet-affiliate/index.remote-resources";
import { getRemoteResource } from "@/services/externals/cplx-api/remote-resources/utils";

import TablerLink from "~icons/tabler/link";

const cometAffiliateConfigPromise = getRemoteResource(
  cometAffiliateRemoteResourceConfig,
  persistentQueryClient,
);

export default function CometAffiliateCard() {
  const cometAffiliateConfig = use(cometAffiliateConfigPromise);

  if (!cometAffiliateConfig.enabled) return null;

  return (
    <div className="x:w-full">
      <CometCard rotateDepth={5} translateDepth={5}>
        <a
          className="x:relative x:flex x:w-full x:cursor-pointer x:flex-col x:items-stretch x:overflow-hidden x:rounded-xl x:border x:border-border/50 x:bg-secondary"
          aria-label="View invite F7RA"
          style={{
            transformStyle: "preserve-3d",
            transform: "none",
            opacity: 1,
          }}
          href={`https://${cometAffiliateConfig.link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://pplx-res.cloudinary.com/image/upload/comet_invites/UdcAbCYG17Ay06IqikhWY_46d59b809c2d466ca5b287f838920074_hxnitm.png"
            alt="Comet Invitation"
            className="x:max-h-40 x:w-full x:object-cover x:object-top"
          />

          <div className="x:flex x:shrink-0 x:flex-col x:items-center x:justify-between x:gap-2 x:py-4 x:font-mono x:text-secondary-foreground">
            <div className="x:flex x:flex-col x:items-center x:gap-1">
              <div className="x:text-xs x:font-medium x:text-muted-foreground">
                Get your free
              </div>
              <PplxPro className="x:inline-block x:text-2xl x:text-primary" />
            </div>
            <div className="x:flex x:items-center x:text-muted-foreground">
              <TablerLink className="x:inline-block x:text-xs" />
              <span className="x:text-xs">
                &nbsp;{cometAffiliateConfig.link}
              </span>
            </div>
          </div>
        </a>
        <div className="x:absolute x:top-4 x:left-4 x:rounded-xl x:bg-muted/85 x:p-2 x:backdrop-blur-sm">
          <PplxComet className="x:size-6 x:text-primary" />
        </div>
      </CometCard>
    </div>
  );
}
