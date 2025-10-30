import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Image } from "@/components/ui/image";
import { H1 } from "@/components/ui/typography";
import { EXTENSION_ICON_ACTIONS_LABEL as OPTIONS_LABEL } from "@/data/dashboard/extension-storage";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function ExtensionIconAction() {
  return (
    <div className="x:mx-auto x:flex x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
      <H1 className="x:text-center x:text-balance">Extension Icon Action</H1>

      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger>
          <div className="x:w-full x:text-center x:underline x:decoration-dashed x:underline-offset-4">
            Where do you want the extension icon to open?
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          <Image
            src="https://i.imgur.com/UF288wx.png"
            alt="Dashboard Shortcut"
            className="x:w-full"
          />
        </HoverCardContent>
      </HoverCard>

      <ExtensionIconActionSelect />
    </div>
  );
}

function ExtensionIconActionSelect() {
  const { settings, mutation } = useExtensionSettings();

  const selectedValue = settings.extensionIconAction;

  const handleOptionClick = (
    option: ExtensionSettings["extensionIconAction"],
  ) => {
    mutation.mutate((draft) => {
      draft.extensionIconAction = option;
    });
  };

  return (
    <div className="x:flex x:w-full x:flex-col x:gap-6 x:md:flex-row">
      <div className="x:flex x:flex-1 x:flex-col x:items-center x:gap-4">
        <h3 className="x:text-lg x:font-semibold x:text-card-foreground">
          Settings Dashboard
        </h3>
        <button
          className="x:block x:transition-all x:duration-200 x:hover:scale-[1.02]"
          onClick={() => handleOptionClick("dashboard")}
        >
          <div
            className={cn(
              "x:mx-auto x:h-[300px] x:w-[400px] x:overflow-hidden x:rounded-xl x:border-2 x:transition-all x:duration-200",
              selectedValue === "dashboard"
                ? "x:border-primary"
                : "x:border-border/50",
            )}
          >
            <img
              src="https://images2.imgbox.com/06/5a/2uZrfS5v_o.png"
              alt="Settings Dashboard"
              className="x:h-full x:w-full x:object-cover x:object-top-left x:shadow-lg"
            />
          </div>
        </button>
        <p className="x:max-w-[400px] x:text-center x:text-sm x:text-muted-foreground">
          {OPTIONS_LABEL.dashboard}
        </p>
      </div>

      <div className="x:flex x:flex-1 x:flex-col x:items-center x:gap-4">
        <h3 className="x:text-lg x:font-semibold x:text-card-foreground">
          Perplexity.ai
        </h3>
        <button
          className="x:block x:transition-all x:duration-200 x:hover:scale-[1.02]"
          onClick={() => handleOptionClick("perplexity")}
        >
          <div
            className={cn(
              "x:mx-auto x:h-[300px] x:w-[400px] x:overflow-hidden x:rounded-xl x:border-2 x:transition-all x:duration-200",
              selectedValue === "perplexity"
                ? "x:border-primary"
                : "x:border-border/50",
            )}
          >
            <img
              src="https://images2.imgbox.com/c3/04/ITzyjssA_o.png"
              alt="Perplexity.ai"
              className="x:h-full x:w-full x:object-cover x:object-top-left x:shadow-lg"
            />
          </div>
        </button>
        <p className="x:max-w-[400px] x:text-center x:text-sm x:text-muted-foreground">
          {OPTIONS_LABEL.perplexity}
        </p>
        {selectedValue === "perplexity" && (
          <HoverCard
            openDelay={0}
            closeDelay={0}
            positioning={{ placement: "right-start" }}
          >
            <HoverCardTrigger>
              <p className="x:max-w-[400px] x:text-center x:text-sm x:text-muted-foreground x:underline x:decoration-dashed x:underline-offset-4">
                How do I access the Settings Dashboard?
              </p>
            </HoverCardTrigger>
            <HoverCardContent>
              <Image
                src="https://i.imgur.com/zgT1Wlz.png"
                alt="How do I access the Settings Dashboard?"
                className="x:max-w-[300px]"
              />
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    </div>
  );
}
