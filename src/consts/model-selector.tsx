import {
  BadgePercent,
  Library,
} from 'lucide-react';
import { AiOutlineOpenAI } from 'react-icons/ai';
import { PiGlobe } from 'react-icons/pi';
import {
  SiAnthropic,
  SiGooglegemini,
  SiPerplexity,
  SiReddit,
  SiWikipedia,
  SiYoutube,
} from 'react-icons/si';
import { TbLetterM } from 'react-icons/tb';

export const webAccessFocus = [
  {
    label: 'All',
    code: 'internet',
    icon: <PiGlobe className="tw-text-[1rem]" />,
  },
  {
    label: 'Wikipedia',
    code: 'wikipedia',
    icon: <SiWikipedia className="tw-text-[1rem]" />,
  },
  {
    label: 'Academic',
    code: 'scholar',
    icon: <Library className="tw-w-4 tw-h-4" />,
  },
  {
    label: 'Wolfram|Alpha',
    code: 'wolfram',
    icon: <BadgePercent className="tw-w-4 tw-h-4" />,
  },
  {
    label: 'Youtube',
    code: 'youtube',
    icon: <SiYoutube className="tw-text-[1rem]" />,
  },
  {
    label: 'Reddit',
    code: 'reddit',
    icon: <SiReddit className="tw-text-[1rem]" />,
  },
] as const;

export const languageModels = [
  {
    label: 'Claude 3.5 Sonnet',
    shortLabel: 'Sonnet',
    code: 'claude2',
    icon: <SiAnthropic />,
  },
  {
    label: 'Claude 3 Opus',
    shortLabel: 'Opus',
    code: 'claude3opus',
    icon: <SiAnthropic />,
  },
  {
    label: 'GPT-4 Omni',
    shortLabel: 'GPT-4o',
    code: 'gpt4o',
    icon: <AiOutlineOpenAI />,
  },
  {
    label: 'GPT-4 Turbo',
    shortLabel: 'GPT-4',
    code: 'gpt4',
    icon: <AiOutlineOpenAI />,
  },
  {
    label: 'Claude 3 Haiku',
    shortLabel: 'Haiku',
    code: 'turbo',
    icon: <SiAnthropic />,
  },
  {
    label: 'Sonar Large 32K',
    shortLabel: 'Sonar',
    code: 'experimental',
    icon: <SiPerplexity />,
  },
  {
    label: 'Mistral Large',
    shortLabel: 'Mistral',
    code: 'mistral',
    icon: <TbLetterM />,
  },
  {
    label: 'Google Gemini',
    shortLabel: 'Gemini',
    code: 'gemini',
    icon: <SiGooglegemini />,
  },
] as const;
