import { HTMLAttributes } from "react";
import { FaDiscord } from "react-icons/fa";

export default function DiscordCallout({
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <span className="tw-max-h-max">
        Join our{" "}
        <a
          href="https://discord.gg/fxzqdkwmWx"
          target="_blank"
          className="tw-inline-flex tw-max-w-max tw-items-baseline tw-justify-center tw-gap-1 tw-text-accent-foreground tw-underline"
          rel="noreferrer"
        >
          <FaDiscord /> Discord
        </a>{" "}
        to get the latest updates and support!
      </span>
    </div>
  );
}
