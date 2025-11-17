export type CodeBlock = {
  nodes: {
    $wrapper: JQuery<Element> | null;
    $nativeCopyButton: JQuery<Element> | null;
  };
  content: {
    language: string;
    code: string;
  };
  states: {
    isInFlight: boolean;
  };
};
