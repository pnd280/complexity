export default function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <span className="tw-flex tw-gap-1">
      {keys.map((key) => (
        <span
          key={key}
          className="tw-border tw-px-1 tw-rounded-sm tw-text-[.7rem] tw-font-mono"
        >
          {key}
        </span>
      ))}
    </span>
  );
}
