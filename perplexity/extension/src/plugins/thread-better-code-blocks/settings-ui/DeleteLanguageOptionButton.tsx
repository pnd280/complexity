import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import TablerTrash from "~icons/tabler/trash";

type DeleteLanguageOptionButtonProps = {
  deleteMutation: () => void;
};

export function DeleteLanguageOptionButton({
  deleteMutation,
}: DeleteLanguageOptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <TablerTrash />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="x:z-100"
        overlayProps={{
          className: "x:z-100",
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Language Option</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this language option? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteMutation();
              setIsOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
