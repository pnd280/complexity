import { SVGProps } from "react";

export default function SpaceIcon({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="0.8em"
      height="0.8em"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M64 243.2V192c70.7 0 128-57.3 128-128h51.2c0 98.9-80.3 179.2-179.2 179.2zm409.6 0c-98.9 0-179.2-80.3-179.2-179.2h51.2c0 70.7 57.3 128 128 128v51.2zm-128 230.4H294.4c0-98.9 80.3-179.2 179.2-179.2v51.2c-70.7 0-128 57.3-128 128zm-102.4 0H192c0-70.7-57.3-128-128-128V294.4c98.9 0 179.2 80.3 179.2 179.2zM268.8 320a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 1 0 0 102.4z"
      />
    </svg>
  );
}
