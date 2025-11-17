import CommandPage from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/components/CommandPage";

declare module "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store/slices/pages/types" {
  interface SlashCommandPagesArgsRegistry {
    index: void;
  }
}

export default function IndexPage() {
  return (
    <CommandPage pageId="index">
      <div className="x:flex x:items-center x:justify-center x:p-8 x:text-center x:text-muted-foreground"></div>
    </CommandPage>
  );
}
