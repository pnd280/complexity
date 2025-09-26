import CommandPage from "@/plugins/slash-command/components/CommandPage";

declare module "@/plugins/slash-command/store/slices/pages/types" {
  interface SlashCommandPagesArgsRegistry {
    index: void;
  }
}

const IndexPage = memo(() => {
  return (
    <CommandPage pageId="index">
      <div className="x:flex x:items-center x:justify-center x:p-8 x:text-center x:text-muted-foreground"></div>
    </CommandPage>
  );
});

export default IndexPage;
