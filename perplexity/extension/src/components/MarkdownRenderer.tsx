import type { HTMLAttributes, ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Pluggable } from "unified";

type MarkdownComponents = ComponentPropsWithoutRef<
  typeof ReactMarkdown
>["components"];

export interface MarkdownRendererProps extends HTMLAttributes<HTMLDivElement> {
  markdown: string;
  components?: MarkdownComponents;
  remarkPlugins?: Pluggable[];
  rehypePlugins?: Pluggable[];
}

export default function MarkdownRenderer({
  markdown,
  components = {},
  remarkPlugins = [remarkGfm],
  rehypePlugins = [rehypeRaw],
  className,
  ...props
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "x:prose x:flex x:max-w-max x:flex-col x:dark:prose-invert",
        className,
      )}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
