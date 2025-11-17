import { FieldGroup } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { ThemeFormControls } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/ThemeFormControls";
import { useThemeFormContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/ThemeFormContext";

import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function ThemeForm() {
  const { form, isPending } = useThemeFormContext();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <ThemeFormControls />
        <div className="x:ml-auto">
          <Button
            type="submit"
            className="x:w-fit"
            disabled={isPending || Object.keys(form.state.errors).length > 0}
          >
            {isPending ? (
              <TablerLoaderCircle className="x:size-4 x:animate-spin" />
            ) : (
              "Create Theme"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
