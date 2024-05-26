import {
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import { useQueryBoxStore } from '@/content-script/session-store/query-box';
import { UserSettingsApiResponse } from '@/types/PPLXApi';
import { fetchResource } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';

import useQueryBoxObserver from '../hooks/useQueryBoxObserver';
import { Separator } from '../ui/separator';
import FocusSelector from './FocusSelector';
import ImageModelSelector, { ImageModel } from './ImageModelSelector';
import LanguageModelSelector, { LanguageModel } from './LanguageModelSelector';

export default function QueryBox() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userSettings'],
    queryFn: fetchUserSettings,
  });

  const {
    setSelectedLanguageModel,
    setSelectedImageModel,
    setQueryLimit,
    setOpusLimit,
    setImageCreateLimit,
  } = useQueryBoxStore((state) => state);

  const {
    toggleProSearch,
  } = useQueryBoxStore((state) => state.webAccess);

  useEffect(() => {
    if (data) {
      setSelectedLanguageModel(data.default_model as LanguageModel['code']);
      setSelectedImageModel(
        data.default_image_generation_model as ImageModel['code']
      );
      setQueryLimit(data.gpt4_limit);
      setOpusLimit(data.opus_limit);
      setImageCreateLimit(data.create_limit);
      toggleProSearch(data.default_copilot);
    }
  }, [data]);

  const [containers, setContainers] = useState<Element[]>([]);
  const [followUpContainers, setFollowUpContainers] = useState<Element[]>([]);

  useQueryBoxObserver({
    setContainers: (newContainer) =>
      setContainers([...containers, newContainer]),
    setFollowUpContainers: (newContainer) =>
      setFollowUpContainers([...followUpContainers, newContainer]),
    refetchModels: refetch,
  });

  if (!data || isLoading) return null;

  const selectors = (
    <>
      <FocusSelector />
      <div className="tw-h-8 tw-flex tw-items-center tw-my-auto">
        <Separator
          orientation="vertical"
          className="tw-mx-2 !tw-h-[60%] tw-animate-in tw-zoom-in"
        />
      </div>
      <LanguageModelSelector />
      <ImageModelSelector />
    </>
  );

  return (
    <>
      {containers.map((container) =>
        ReactDOM.createPortal(selectors, container)
      )}
      {followUpContainers.map((container) =>
        ReactDOM.createPortal(selectors, container)
      )}
    </>
  );
}

async function fetchUserSettings(): Promise<UserSettingsApiResponse> {
  const resp = fetchResource(
    'https://www.perplexity.ai/p/api/v1/user/settings'
  );

  const data = await resp;

  return JSON.parse(data);
}
