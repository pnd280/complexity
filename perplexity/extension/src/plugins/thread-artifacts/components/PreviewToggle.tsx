import {
  ARTIFACTS_LANGUAGE_PREVIEW_TOGGLE_TEXT,
  ARTIFACTS_LANGUAGE_RAW_TOGGLE_TEXT,
} from "@/plugins/thread-artifacts/consts";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import type { ArtifactLanguage } from "@/plugins/thread-artifacts/types";

export default function PreviewToggle({
  language,
}: {
  language: ArtifactLanguage;
}) {
  const { state, setState } = useArtifactsStore();

  return (
    <div
      className="x:flex x:cursor-pointer x:items-center x:overflow-hidden x:rounded-md x:border x:border-border/50 x:bg-secondary x:animate-in x:select-none x:fade-in"
      onClick={() => setState(state === "code" ? "preview" : "code")}
    >
      <div
        className={cn("x:p-1 x:px-4 x:text-muted-foreground", {
          "x:rounded-md x:bg-primary x:text-primary-foreground x:transition-all":
            state === "preview",
        })}
      >
        {ARTIFACTS_LANGUAGE_PREVIEW_TOGGLE_TEXT[language]}
      </div>
      <div
        className={cn("x:p-1 x:px-4 x:text-muted-foreground", {
          "x:rounded-md x:bg-primary x:text-primary-foreground x:transition-all":
            state === "code",
        })}
      >
        {ARTIFACTS_LANGUAGE_RAW_TOGGLE_TEXT[language]}
      </div>
    </div>
  );
}
