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

  if (typeof ClipboardItem !== "undefined") {
    const html = new Blob([richText], { type: "text/html" });
    const text = new Blob([markdown], { type: "text/plain" });
    const data = new ClipboardItem({
      "text/html": html,
      "text/plain": text,
    });
    await navigator.clipboard.write([data]);
  } else {
    const listener = (e: ClipboardEvent) => {
      e.clipboardData?.setData("text/html", richText);
      e.clipboardData?.setData("text/plain", markdown);
      e.preventDefault();
    };
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  }
}
