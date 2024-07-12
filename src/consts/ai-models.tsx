import { AiOutlineOpenAI } from 'react-icons/ai';
import {
  SiAnthropic,
  SiGooglegemini,
  SiPerplexity
} from 'react-icons/si';
import { TbLetterM } from 'react-icons/tb';

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
