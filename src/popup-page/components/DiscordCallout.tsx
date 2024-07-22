import { FaDiscord } from "react-icons/fa";

export default function DiscordCallout() {
  return (
    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-1 tw-px-4 tw-py-2 tw-text-center tw-text-lg">
      <a
        href="https://discord.gg/fxzqdkwmWx"
        target="_blank"
        className="tw-flex tw-max-w-max tw-items-center tw-justify-center tw-gap-1 tw-text-accent-foreground tw-underline"
      >
        <FaDiscord /> Discord
      </a>{" "}
      <span className="tw-max-h-max tw-text-sm">
        join to get the latest updates and support!
      </span>
    </div>
  );
}
