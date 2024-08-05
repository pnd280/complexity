import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import showdown from "showdown";

import useExtensionUpdate from "@/shared/hooks/useExtensionUpdate";
import { escapeHtmlTags } from "@/utils/utils";

export default function Changelog() {
  const { changelog: rawData, isChangelogFetching } = useExtensionUpdate({
    forceFetchChangelog: true,
  });

  const [content, setContent] = useState("");

  useEffect(() => {
    if (!rawData) return;

    const converter = new showdown.Converter();

    converter.setOption("simpleLineBreaks", true);

    setContent(converter.makeHtml(escapeHtmlTags(rawData)));
  }, [rawData]);

  return (
    <>
      {isChangelogFetching ? (
        <div className="tw-mx-auto tw-flex tw-w-max tw-items-center tw-gap-2">
          <LoaderCircle className="tw-animate-spin" />
          <span className="tw-text-xl">Loading...</span>
        </div>
      ) : (
        <div className="tw-prose tw-max-w-full">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </>
  );
}
