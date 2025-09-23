import type { SVGProps } from "react";

export function MdiWrapDisabled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
      <path
        fill="currentColor"
        d="M16 7H3V5h13zM3 19h13v-2H3zm19-7l-4-3v2H3v2h15v2z"
      />
    </svg>
  );
}
