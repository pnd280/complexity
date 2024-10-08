import * as React from "react";

const FlagVietnam = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="0.8em"
    height="0.8em"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 511.9 511.9"
    xmlSpace="preserve"
    {...props}
  >
    <path
      style={{
        fill: "#ff4b55",
      }}
      d="M473.7 88.25H38.3c-21.1 0-38.3 17.1-38.3 38.3v258.8c0 21.2 17.2 38.3 38.3 38.3h435.3c21.2 0 38.3-17.2 38.3-38.3v-258.8c.1-21.2-17.1-38.3-38.2-38.3"
    />
    <path
      style={{
        fill: "#ffe15a",
      }}
      d="m260.1 155.95 23.6 70.8 74.6.6c4.2 0 5.9 5.4 2.5 7.8l-60 44.3 22.5 71.1c1.3 4-3.3 7.3-6.7 4.8l-60.6-43.3-60.7 43.4c-3.4 2.4-7.9-.9-6.7-4.8l22.5-71.1-60-44.3c-3.4-2.5-1.6-7.8 2.5-7.8l74.6-.6 23.6-70.8c1.4-4.1 7-4.1 8.3-.1"
    />
  </svg>
);

export default FlagVietnam;
