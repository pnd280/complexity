import type { SVGProps } from "react";

export default function Incognito(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="0.8em"
      height="0.8em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 11h18 M5 11v-4a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v4 M7 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M10 17h4"></path>
    </svg>
  );
}
