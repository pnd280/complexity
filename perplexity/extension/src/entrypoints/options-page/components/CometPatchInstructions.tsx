import { useQuery } from "@tanstack/react-query";

import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";

import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function CometPatchInstructions() {
  const { data, error, isLoading } = useQuery({
    ...cplxApiQueries.cometPatchTutorial.detail({
      platform: getPlatform() === "windows" ? "win" : "mac",
    }),
  });

  if (isLoading) {
    return (
      <div className="x:mx-auto x:my-40 x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
        <TablerLoaderCircle className="x:size-10 x:animate-spin x:text-muted-foreground" />
        <div className="x:animate-pulse">fetching content, please wait...</div>
        <Button
          variant="link"
          onClick={() => {
            void chrome.tabs.create({
              url: "https://github.com/pnd280/complexity/blob/nxt/perplexity/extension/docs/articles/comet-enable-extensions-article.md",
              active: false,
            });
            toast({
              description:
                "Please follow the instructions in the newly opened tab or else the extension will not work on Comet.",
            });
          }}
        >
          Open the instructions in a new tab
        </Button>
      </div>
    );
  }

  return (
    <>
      {error != null && (
        <div className="x:my-40 x:text-center x:text-balance">
          <div className="x:text-xl x:text-caution">
            Error fetching content, try this{" "}
            <a
              href="https://github.com/pnd280/complexity/blob/nxt/perplexity/extension/docs/comet-enable-extensions.md"
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
    </>
  );
}
