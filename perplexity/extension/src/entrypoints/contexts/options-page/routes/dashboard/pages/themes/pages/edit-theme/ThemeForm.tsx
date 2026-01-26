import { FieldGroup } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { ThemeFormControls } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/ThemeFormControls";
import { useThemeFormContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/context/ThemeFormContext";
import { DeleteButton } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/pages/edit-theme/components/DeleteButton";
import { useEditThemeContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/pages/edit-theme/context";

import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function ThemeForm() {
  const { form, isPending } = useThemeFormContext();
  const { deleteTheme, isDeleting } = useEditThemeContext();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <ThemeFormControls />
        <div className="x:ml-auto x:flex x:flex-row x:items-center x:gap-4">
          <DeleteButton isDeleting={isDeleting} onDelete={deleteTheme} />
          <Button
            type="submit"
            className="x:w-fit"
            disabled={isPending || Object.keys(form.state.errors).length > 0}
          >
            {isPending ? (
              <TablerLoaderCircle className="x:size-4 x:animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
