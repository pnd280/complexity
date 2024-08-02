import { SVGProps } from "react";

export default function PlaygroundAiIcon({
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="0.8em"
      height="0.8em"
      viewBox="0 0 38 38"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38 19C38 8.50659 29.4934 0 19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38C29.4934 38 38 29.4934 38 19ZM19.1765 3C17.942 3 16.9412 4.00073 16.9412 5.23535V32.0588C16.9412 33.2935 17.942 34.2942 19.1765 34.2942C20.411 34.2942 21.4118 33.2935 21.4118 32.0588V5.23535C21.4118 4.00073 20.411 3 19.1765 3ZM8 18.6472C8 14.0645 10.7582 10.1257 14.7051 8.40088V28.8933C10.7582 27.1685 8 23.23 8 18.6472ZM30.3529 18.6472C30.3529 23.2305 27.594 27.1694 23.6463 28.894V8.40039C27.594 10.1248 30.3529 14.0637 30.3529 18.6472Z"
        fill="currentColor"
      />
    </svg>
  );
}
