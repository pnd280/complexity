import { BadgePercent, Library } from "lucide-react";
import { AiOutlineOpenAI } from "react-icons/ai";
import { BiNetworkChart } from "react-icons/bi";
import { PiGlobe } from "react-icons/pi";
import {
  SiAnthropic,
  SiMeta,
  SiPerplexity,
  SiWikipedia,
  SiYoutube,
} from "react-icons/si";
import { TbLetterM } from "react-icons/tb";

export const languageModels = [
  {
    label: "Claude 3.5 Sonnet",
    shortLabel: "Sonnet",
    code: "claude2",
    icon: <SiAnthropic />,
  },
  {
    label: "Llama 3.1 405B",
    shortLabel: "Llama 3.1 405B",
    code: "llama_x_large",
    icon: <SiMeta />,
  },
  {
    label: "GPT-4 Omni",
    shortLabel: "GPT-4o",
    code: "gpt4o",
    icon: <AiOutlineOpenAI />,
  },
  {
    label: "Claude 3 Opus",
    shortLabel: "Opus",
    code: "claude3opus",
    icon: <SiAnthropic />,
  },
  {
    label: "GPT-4 Turbo",
    shortLabel: "GPT-4",
    code: "gpt4",
    icon: <AiOutlineOpenAI />,
  },
  {
    label: "Claude 3 Haiku",
    shortLabel: "Haiku",
    code: "turbo",
    icon: <SiAnthropic />,
  },
  {
    label: "Sonar Large 32K",
    shortLabel: "Sonar",
    code: "experimental",
    icon: <SiPerplexity />,
  },
  {
    label: "Mistral Large",
    shortLabel: "Mistral",
    code: "mistral",
    icon: <TbLetterM />,
  },
] as const;

export const webAccessFocus = [
  {
    label: "All",
    code: "internet",
    icon: <PiGlobe className="tw-text-[1rem]" />,
  },
  {
    label: "Wikipedia",
    code: "wikipedia",
    icon: <SiWikipedia className="tw-text-[1rem]" />,
  },
  {
    label: "Academic",
    code: "scholar",
    icon: <Library className="tw-size-4" />,
  },
  {
    label: "Math",
    code: "wolfram",
    icon: <BadgePercent className="tw-size-4" />,
  },
  {
    label: "Video",
    code: "youtube",
    icon: <SiYoutube className="tw-text-[1rem]" />,
  },
  {
    label: "Social",
    code: "reddit",
    icon: <BiNetworkChart className="tw-text-[1rem]" />,
  },
] as const;

export function ProSearchIcon({
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fak"
        data-icon="copilot"
        className="svg-inline--fa fa-copilot"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M167.4 283.1c-.5-9-1-17.9-1-27.1s.3-18.4 1-27.1c1.3-19.5 3.6-37.6 6.9-54.5c4.1-20.2 9.7-38.4 16.1-54.3c10-24.6 22.3-43.3 35.6-55c10-8.7 20.2-13.6 30.2-13.6s20.2 4.9 30.2 13.6c24.3 1.3 47.4 4.1 69.1 8.4C330.2 27.9 295.4 .3 256 .3s-74.2 27.6-99.6 73.2c-9.7 17.2-17.9 37.1-24.3 58.9c-5.4 18.2-9.5 37.6-12.3 58.1c-2.6 18.9-4.4 38.9-4.6 59.6c0 2 0 4.1 0 6.1s0 4.1 0 6.1c11.3 7.2 28.9 14.8 52 21.2l.3-.5zm177.1-54.3c.5 9 1 17.9 1 27.1s-.3 18.4-1 27.1c-1.3 19.5-3.6 37.6-6.9 54.5c-4.1 20.2-9.7 38.4-16.1 54.3c-10 24.6-22.3 43.3-35.6 55c-10 8.7-20.2 13.6-30.2 13.6s-20.2-4.9-30.2-13.6c-24.3-1.3-47.4-4.1-69.1-8.4c25.3 45.6 60.2 73.2 99.6 73.2s74.2-27.6 99.6-73.2c9.7-17.2 17.9-37.1 24.3-58.9c5.4-18.2 9.5-37.6 12.3-58.1c2.6-18.9 4.4-38.9 4.6-59.6c0-2 0-4.1 0-6.1s0-4.1 0-6.1c-11.3-7.2-28.9-14.8-52-21.2l-.3 .5zm94.2-72.4c-17.2-9.7-37.1-17.9-58.9-24.3c-18.2-5.4-37.6-9.5-58.1-12.3c-18.9-2.6-38.9-4.4-59.6-4.6c-2 0-10.2 0-12.3 0c-7.2 11.3-15.1 28.9-21.2 52c9-.5 17.9-1 27.4-1s18.4 .3 27.4 1c19.2 1.3 37.6 3.6 54.3 6.9c20.2 4.1 38.4 9.7 54.3 16.1c24.6 10 43.3 22.3 55 35.6c8.7 10 13.6 20.2 13.6 30.2s-4.9 20.2-13.6 30.2c-1.3 24.3-4.1 47.4-8.4 69.1c45.6-25.3 73.2-60.2 73.2-99.6s-27.6-74.2-73.2-99.6l.3 .3zM262.1 396.5c7.2-11.3 15.1-28.9 21.2-52c-9 .5-17.9 1-27.4 1s-18.4-.3-27.4-1c-19.2-1.3-37.6-3.6-54.3-6.9c-20.2-4.1-38.4-9.7-54.3-16.1c-24.6-10-43.3-22.3-55-35.6c-8.7-10-13.6-20.2-13.6-30.2s4.9-20.2 13.6-30.2c1.3-24.3 4.1-47.4 8.4-69.1C27.9 181.8 .3 216.6 .3 256s27.6 74.2 73.2 99.6c17.2 9.7 37.1 17.9 58.9 24.3c18.2 5.4 37.6 9.5 58.1 12.3c18.9 2.6 38.9 4.4 59.6 4.6c4 0 8-.3 12-.3zM256 307.2a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 1 0 0 102.4z"
        ></path>
      </svg>
    </div>
  );
}
