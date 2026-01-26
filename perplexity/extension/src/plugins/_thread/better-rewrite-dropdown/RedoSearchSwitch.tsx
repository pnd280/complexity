import Tooltip from "@/components/Tooltip";
import { Checkbox } from "@/components/ui/checkbox";

export default function RedoSearchSwitch({
  redoSearch,
  setRedoSearch,
  className,
}: {
  redoSearch: boolean;
  setRedoSearch: (redoSearch: boolean) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <Checkbox
        checked={redoSearch}
        label={
          <Tooltip content={t("plugin-thread-better-rewrite-dropdown.tooltip")}>
            <div className="x:underline x:decoration-dashed x:underline-offset-4">
              {t("plugin-thread-better-rewrite-dropdown.redoSearch")}
            </div>
          </Tooltip>
        }
        className="x:ml-auto x:w-fit x:flex-row-reverse x:items-center"
        onCheckedChange={({ checked }) => setRedoSearch(Boolean(checked))}
      />
    </div>
  );
}
