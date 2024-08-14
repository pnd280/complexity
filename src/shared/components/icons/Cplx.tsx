import { SVGProps } from "react";

export default function Cplx(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 257 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M61.9974 21.9283L122.543 77.7179V77.7052V22.057H134.328V77.9676L195.145 21.9283V85.5368H220.114V177.286H195.221V233.926L134.328 180.421V234.541H122.543V181.303L62.066 234.576V177.286H37.0962V85.5368H61.9974V21.9283ZM113.657 97.1799H48.8819V165.643H62.0512V144.047L113.657 97.1799ZM73.8511 149.213V208.595L122.543 165.704V104.983L73.8511 149.213ZM134.667 165.137V104.925L183.373 149.159V177.286H183.436V207.989L134.667 165.137ZM195.221 165.643H208.328V97.1799H144.035L195.221 143.562V165.643ZM183.359 85.5368V48.7099L143.392 85.5368H183.359ZM113.749 85.5368H73.7832V48.7099L113.749 85.5368Z"
        fill="var(--primary)"
      />
      <rect
        x={37.0962}
        y={85.4723}
        width={183.127}
        height={12.0083}
        fill="currentColor"
      />
      <rect
        x={134.539}
        y={22.0351}
        width={143.099}
        height={12.0083}
        transform="rotate(90 134.539 22.0351)"
        fill="currentColor"
      />
      <path
        d="M195.221 143.563L61.9976 21.9307L61.9875 37.895L183.37 149.155L195.221 143.563Z"
        fill="currentColor"
        stroke="currentColor"
      />
      <path
        d="M61.6794 144.145L194.903 22.5125L194.913 38.4768L73.5304 149.737L61.6794 144.145Z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  );
}
