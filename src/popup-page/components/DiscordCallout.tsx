import { FaDiscord } from 'react-icons/fa';

export default function DiscordCallout() {
  return (
    <div className="tw-px-4 tw-py-2 tw-text-lg tw-flex tw-flex-wrap tw-gap-1 tw-justify-center tw-text-center tw-items-center">
      <a
        href="https://discord.gg/fxzqdkwmWx"
        target="_blank"
        className="tw-text-accent-foreground tw-flex tw-items-center tw-gap-1 tw-max-w-max tw-justify-center tw-underline"
      >
        <FaDiscord /> Discord
      </a>{' '}
      <span className="tw-text-sm tw-max-h-max">
        join to get the latest updates and support!
      </span>
    </div>
  );
}
