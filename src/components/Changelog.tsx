import {
  useEffect,
  useState,
} from 'react';

import showdown from 'showdown';

import {
  escapeHtmlTags,
  fetchResource,
} from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';

const url = chrome.runtime.getURL('changelog.md');

export default function Changelog() {
  const { data: rawData, isLoading: isRawDataLoading } = useQuery({
    queryKey: ['changelog'],
    queryFn: () => fetchResource(url),
  });

  const [content, setContent] = useState('');

  useEffect(() => {
    if (!rawData) return;

    const converter = new showdown.Converter();

    converter.setOption('simpleLineBreaks', true);

    setContent(converter.makeHtml(escapeHtmlTags(rawData)));
  }, [rawData]);

  if (isRawDataLoading) return null;

  return (
    <div className="tw-prose">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
