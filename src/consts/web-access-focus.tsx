import { BadgePercent, Library } from 'lucide-react';
import { BiNetworkChart } from 'react-icons/bi';
import { PiGlobe } from 'react-icons/pi';
import { SiWikipedia, SiYoutube } from 'react-icons/si';

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
    label: 'Math',
    code: 'wolfram',
    icon: <BadgePercent className="tw-w-4 tw-h-4" />,
  },
  {
    label: 'Video',
    code: 'youtube',
    icon: <SiYoutube className="tw-text-[1rem]" />,
  },
  {
    label: 'Social',
    code: 'reddit',
    icon: <BiNetworkChart className="tw-text-[1rem]" />,
  },
] as const;
