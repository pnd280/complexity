export default function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <span className="tw-flex tw-gap-1">
      {keys.map((key) => (
        <span
          key={key}
          className="tw-rounded-sm tw-border tw-px-1 tw-font-mono tw-text-[.7rem]"
        >
          {key}
        </span>
      ))}
    </span>
  );
}
