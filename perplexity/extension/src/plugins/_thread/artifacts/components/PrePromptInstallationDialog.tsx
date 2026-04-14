import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import AsyncButton from "@/components/AsyncButton";
import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { softNavigate } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { PplxApiService } from "@/entrypoints/services/externals/pplx-api";
import { setCookie } from "@/utils/dom-utils/generics";
import { fetchTextResource } from "@/utils/misc/utils";
import { tryCatch } from "@/utils/wrappers/try-catch";

import TablerLoaderCircle from "~icons/tabler/loader-2";

export function ArtifactsPrePromptInstallationDialog() {
  const navigate = useNavigate();

  const {
    data: artfiactsInstruction,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["artifacts", "instructions"],
    queryFn: () => {
      return fetchTextResource(
        `https://cdn.cplx.app/resources/artifacts-instruction.md?t=${Date.now()}`,
      );
    },
  });

  const { mutateAsync: createSpace } = useMutation({
    mutationKey: ["createSpace"],
    mutationFn: (space: Parameters<typeof PplxApiService.createSpace>[0]) => {
      return PplxApiService.createSpace(space);
    },
    onSuccess: async (data) => {
      toast({
        title: `✅ "CPLX Artifacts" Space installed`,
        description: "The Artifacts Pre-Prompt has been installed as a Space.",
      });

      setCookie(
        `pplx.source-selection-v3-space-${data.uuid}`,
        JSON.stringify([]),
        365,
      );

      await tryCatch(() =>
        PplxApiService.updateSpace(data.uuid, {
          enable_web_by_default: false,
        }),
      );

      void softNavigate(`/spaces/${data.slug}`);
    },
    onError: () => {
      toast({
        title: `❌ Failed to install "CPLX Artifacts" Space`,
      });
    },
    onSettled: () => {
      void navigate("/");
    },
  });

  return (
    <Dialog
      defaultOpen={true}
      closeOnInteractOutside={false}
      closeOnEscape={false}
      onExitComplete={() => {
        void navigate("/");
      }}
    >
      <DialogContent className="x:max-w-max">
        <DialogHeader>
          <DialogTitle>Install Artifacts Pre-Prompt as Space</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You are about to install the Artifacts Pre-Prompt as a
          Perplexity&apos;s Space. This will enable advanced features for the
          Artifacts plugin.
        </DialogDescription>
        <div className="x:flex x:w-full x:flex-col x:gap-2">
          <div className="x:text-sm x:text-muted-foreground">
            For reference, here is the prompt:
          </div>
          <ScrollArea className="x:h-[500px] x:w-full x:rounded-md x:border x:border-border/50 x:bg-secondary x:text-sm x:text-secondary-foreground">
            {isFetching && !artfiactsInstruction && (
              <div className="x:flex x:flex-col x:gap-2">
                <p className="x:p-4 x:text-sm x:text-muted-foreground">
                  Fetching the Artifacts Pre-Prompt, please wait...
                </p>
              </div>
            )}
            {isError && (
              <div className="x:flex x:flex-col x:gap-2">
                <p className="x:p-4 x:text-sm x:text-muted-foreground">
                  Failed to fetch the Artifacts Pre-Prompt.
                </p>
              </div>
            )}
            {artfiactsInstruction && (
              <>
                <CopyButton
                  className="x:float-right x:mt-4 x:mr-4"
                  content={artfiactsInstruction}
                />
                <div className="x:max-w-full x:p-4 x:wrap-break-word x:whitespace-pre-line">
                  {artfiactsInstruction}
                </div>
              </>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild tabIndex={-1}>
            <Button>Cancel</Button>
          </DialogClose>
          <AsyncButton
            disabled={isFetching || !artfiactsInstruction}
            loadingText={
              <div className="x:flex x:items-center x:gap-2">
                <TablerLoaderCircle className="x:animate-spin" />
                <span>Installing...</span>
              </div>
            }
            onClick={async () => {
              if (!artfiactsInstruction) {
                return;
              }

              await createSpace({
                title: "CPLX Artifacts",
                description: "",
                emoji: "1f5bc-fe0f",
                instructions: artfiactsInstruction,
              });
            }}
          >
            Install
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
