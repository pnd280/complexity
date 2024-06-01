import { useEffect } from 'react';

import { Infinity } from 'lucide-react';
import { AiOutlineOpenAI } from 'react-icons/ai';
import {
  SiAnthropic,
  SiGooglegemini,
  SiPerplexity,
} from 'react-icons/si';
import { TbLetterM } from 'react-icons/tb';
import { useImmer } from 'use-immer';

import { useQueryBoxStore } from '@/content-script/session-store/query-box';

import ModelSelector from './ModelSelector';

export const languageModels = [
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
    label: 'Claude 3 Opus',
    shortLabel: 'Opus',
    code: 'claude3opus',
    icon: <SiAnthropic />,
  },
  {
    label: 'Claude 3 Sonnet',
    shortLabel: 'Sonnet',
    code: 'claude2',
    icon: <SiAnthropic />,
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

export type LanguageModel = (typeof languageModels)[number] & { tooltip?: any };

type LanguageModelSelectorProps = {};

export default function LanguageModelSelector({}: LanguageModelSelectorProps) {
  const limit = useQueryBoxStore((state) => state.queryLimit);
  const opusLimit = useQueryBoxStore((state) => state.opusLimit);

  const getModelLimit = (model: LanguageModel) => {
    if (model.code === 'claude3opus') {
      return opusLimit;
    }

    if (model.code === 'turbo') {
      return <Infinity className="tw-w-3 tw-h-4" />;
    }

    return limit;
  };

  const [models, setModels] = useImmer<LanguageModel[]>(
    languageModels.map((model) => {
      return {
        ...model,
        tooltip: getModelLimit(model),
      };
    })
  );

  const value = useQueryBoxStore((state) => state.selectedLanguageModel);
  const setValue = useQueryBoxStore((state) => state.setSelectedLanguageModel);

  useEffect(() => {
    setModels((draft) => {
      draft.forEach((model) => {
        model.tooltip = getModelLimit(model);
      });
    });
  }, [limit, opusLimit]);

  return (
    <ModelSelector
      type="language"
      items={models}
      onValueChange={setValue}
      value={value}
    />
  );
}

function isValidLanguageModel(model?: string): model is LanguageModel['code'] {
  console.log(languageModels.some((m) => m.code === model));
  return languageModels.some((m) => m.code === model);
}
