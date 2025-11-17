import { Result } from "@/components/Result";

import TablerPuzzle from "~icons/tabler/puzzle";

export default function NoPluginsFound() {
  return (
    <Result
      icon={TablerPuzzle}
      title="No plugins found"
      description={
        <div className="x:text-balance">
          Try adjusting your search term/filters or{" "}
          <a
            href="https://discord.cplx.app/"
            className="x:underline x:transition-colors x:hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            request a new one
          </a>
        </div>
      }
    />
  );
}
