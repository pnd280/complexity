import { useStepsContext } from "@ark-ui/react";
import { useQuery } from "@tanstack/react-query";

import PplxComet from "@/components/icons/PplxComet";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";

import TablerBrandChrome from "~icons/tabler/brand-chrome";
import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function CometPatch() {
  const context = useStepsContext();

  const [isCometSelected, setIsCometSelected] = useState(false);

  const { data, error, isLoading } = useQuery({
    ...cplxApiQueries.cometPatchTutorial.detail(),
    enabled: isCometSelected,
  });

  if (isCometSelected) {
    if (isLoading) {
      return (
        <div className="x:mx-auto x:my-40 x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
          <TablerLoaderCircle className="x:size-10 x:animate-spin x:text-muted-foreground" />
          <div className="x:animate-pulse">
            fetching content, please wait...
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              void chrome.tabs.create({
                url: "https://github.com/pnd280/complexity/blob/nxt/perplexity/extension/docs/articles/comet-enable-extensions-article.md",
                active: false,
              });
              context.goToNextStep();
              toast({
                description:
                  "Please follow the instructions in the newly opened tab or else the extension will not work on Comet.",
              });
            }}
          >
            Skip
          </Button>
        </div>
      );
    }

    return (
      <div className="x:mx-auto x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
        <h1 className="x:sr-only">Comet Patching Instructions</h1>
        <div className="x:text-center x:text-balance">
          <PplxComet className="x:size-25 x:text-foreground" />
        </div>

        {error != null && (
          <div className="x:my-40 x:text-center x:text-balance">
            <div className="x:text-xl x:text-destructive">
              Error fetching content, try this{" "}
              <a
                href="https://github.com/pnd280/complexity/blob/nxt/perplexity/extension/docs/articles/comet-enable-extensions-article.md"
                className="x:text-xl x:text-primary x:underline"
              >
                url
              </a>
              .
            </div>
          </div>
        )}

        {data != null && error == null && (
          <MarkdownRenderer
            markdown={data}
            className="x:max-w-2xl x:text-foreground"
          />
        )}

        <Button
          onClick={() => {
            context.goToNextStep();
          }}
        >
          I've completed the instructions
        </Button>
      </div>
    );
  }

  return (
    <div className="x:mx-auto x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
      <H1 className="x:text-center x:text-balance">Choose your browser</H1>
      <div className="x:my-25 x:flex x:w-full x:flex-wrap x:items-start x:justify-around x:gap-4">
        <div
          className="x:flex x:flex-col x:items-center x:justify-center x:gap-4"
          onClick={() => context.goToNextStep()}
        >
          <TablerBrandChrome className="x:size-30 x:cursor-pointer x:text-muted-foreground x:transition-all x:hover:text-primary" />
          <div className="x:flex x:flex-col x:items-center x:justify-center x:gap-2">
            <div className="x:font-mono x:text-2xl x:font-medium">Chromium</div>
            <div className="x:max-w-[150px] x:text-center x:text-base x:text-muted-foreground">
              Google Chrome, Edge, Brave, Vivaldi, etc.
            </div>
          </div>
        </div>
        <div
          className="x:flex x:flex-col x:items-center x:justify-center x:gap-4"
          onClick={() => {
            setIsCometSelected(true);
          }}
        >
          <PplxComet className="x:size-30 x:cursor-pointer x:text-muted-foreground x:transition-all x:hover:text-primary" />
          <div className="x:flex x:flex-col x:items-center x:justify-center x:gap-2">
            <div className="x:font-mono x:text-2xl x:font-medium">Comet</div>
            <div className="x:text-base x:text-muted-foreground">
              Perplexity's AI browser
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
