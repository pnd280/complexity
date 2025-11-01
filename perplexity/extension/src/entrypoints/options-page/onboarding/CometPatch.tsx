import { useStepsContext } from "@ark-ui/react";

import PplxComet from "@/components/icons/PplxComet";
import { Button } from "@/components/ui/button";
import CometPatchInstructions from "@/entrypoints/options-page/components/CometPatchInstructions";

export default function CometPatch() {
  const context = useStepsContext();

  return (
    <div className="x:mx-auto x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-16 x:md:px-4">
      <h1 className="x:sr-only">Comet Patching Instructions</h1>
      <div className="x:text-center x:text-balance">
        <PplxComet className="x:size-25 x:text-foreground" />
      </div>

      <CometPatchInstructions />

      <Button
        variant="ghostNoOutline"
        onClick={() => {
          context.goToNextStep();
        }}
      >
        No, I&apos;m not using Comet
      </Button>
    </div>
  );
}
