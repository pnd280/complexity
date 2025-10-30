import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(remarkGfm)
  .use(rehypeSanitize)
  .use(rehypeStringify);

export async function dualClipboardPut({
  markdown,
}: {
  markdown: string;
}): Promise<void> {
  const richText = (await processor.process(markdown)).value as string;

  const waitUntilTabActive = async () => {
    if (!document.hasFocus()) {
      await new Promise<void>((resolve) => {
        const handler = () => {
          if (document.hasFocus()) {
            window.removeEventListener("focus", handler);
            setTimeout(() => {
              resolve();
            }, 500);
          }
        };
        window.addEventListener("focus", handler);
      });
    }
  };

  if (typeof ClipboardItem !== "undefined") {
    const html = new Blob([richText], { type: "text/html" });
    const text = new Blob([markdown], { type: "text/plain" });
    const data = new ClipboardItem({
      "text/html": html,
      "text/plain": text,
    });

    await waitUntilTabActive();

    await navigator.clipboard.write([data]);
  } else {
    const listener = (e: ClipboardEvent) => {
      e.clipboardData?.setData("text/html", richText);
      e.clipboardData?.setData("text/plain", markdown);
      e.preventDefault();
    };
    document.addEventListener("copy", listener);

    await waitUntilTabActive();

    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  }
}
