import { useEffect } from 'react';

import { AiOutlineOpenAI } from 'react-icons/ai';
import {
  TbLetterP,
  TbLetterS,
} from 'react-icons/tb';
import { useImmer } from 'use-immer';

import { useQueryBoxStore } from '@/content-script/session-store/query-box';
import { webpageMessenger } from '@/content-script/webpage/messenger';
import { WSMessageParser } from '@/utils/ws';

import ModelSelector from './ModelSelector';

const imageModels = [
  {
    label: 'DALL-E 3',
    shortLabel: 'DALL-E',
    code: 'dall-e-3',
    icon: <AiOutlineOpenAI />,
  },
  {
    label: 'Playground',
    shortLabel: 'Playground',
    code: 'default',
    icon: <TbLetterP />,
  },
  {
    label: 'Stable Diffusion XL',
    shortLabel: 'SDXL',
    code: 'sdxl',
    icon: <TbLetterS />,
  },
] as const;

export type ImageModel = (typeof imageModels)[number] & {
  tooltip?: number;
};

type ModelSelectorProps = {};

export default function ImageModelSelector({}: ModelSelectorProps) {
  const limit = useQueryBoxStore((state) => state.imageCreateLimit);

  const [models, setModels] = useImmer<ImageModel[]>(
    imageModels.map((model) => ({
      ...model,
      tooltip: limit,
    }))
  );

  const value = useQueryBoxStore((state) => state.selectedImageModel);
  const setValue = useQueryBoxStore((state) => state.setSelectedImageModel);

  useEffect(() => {
    setModels((draft) => {
      draft.forEach((model) => {
        model.tooltip = limit;
      });
    });
  }, [limit]);

  const handleSetModel = async (value: ImageModel['code']) => {
    try {
      await webpageMessenger.sendMessage({
        event: 'sendWebsocketMessage',
        payload: WSMessageParser.stringify({
          messageCode: 423,
          event: 'save_user_settings',
          data: {
            default_image_generation_model: value,
          },
        })
      });

      setValue(value);
    } catch (e) {
      alert('Failed to change image model');
    }
  };

  return (
    <ModelSelector
      type="image"
      items={models}
      onValueChange={handleSetModel}
      value={value}
    />
  );
}

function isValidImageModel(model?: string): model is ImageModel['code'] {
  return imageModels.some((m) => m.code === model);
}
