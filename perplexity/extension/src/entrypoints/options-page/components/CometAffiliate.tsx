import { CometCard } from "@/components/CometCard";
import PplxPro from "@/components/icons/PplxPro";

import TablerLink from "~icons/tabler/link";

export default function CometAffiliate() {
  return (
    <div className="x:w-full">
      <CometCard rotateDepth={5} translateDepth={5}>
        <a
          className="x:flex x:w-full x:cursor-pointer x:flex-col x:items-stretch x:overflow-hidden x:rounded-xl x:border x:border-border/50 x:bg-secondary"
          aria-label="View invite F7RA"
          style={{
            transformStyle: "preserve-3d",
            transform: "none",
            opacity: 1,
          }}
          href="https://pplx.ai/pnd280"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://pplx-res.cloudinary.com/image/upload/comet_invites/UdcAbCYG17Ay06IqikhWY_46d59b809c2d466ca5b287f838920074_hxnitm.png"
            alt="Comet Invitation"
            className="x:max-h-40 x:w-full x:object-cover"
          />
          <div className="x:flex x:flex-shrink-0 x:flex-col x:items-center x:justify-between x:gap-2 x:py-4 x:font-mono x:text-secondary-foreground">
            <div className="x:flex x:flex-col x:items-center x:gap-1">
              <div className="x:text-xs x:font-medium x:text-muted-foreground">
                Get your free
              </div>
              <PplxPro className="x:inline-block x:text-2xl x:text-primary" />
            </div>
            <div className="x:flex x:items-center x:text-muted-foreground">
              <TablerLink className="x:inline-block x:text-xs" />
              <span className="x:text-xs">&nbsp;pplx.ai/pnd280</span>
            </div>
          </div>
        </a>
      </CometCard>
    </div>
  );
}
