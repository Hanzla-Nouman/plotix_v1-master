import { UseFormReturn } from "react-hook-form";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

export default function FormFooter({ form, isLoading }: {
  form: UseFormReturn<any, undefined>,
  isLoading?: boolean
}) {
  return (
    <DialogFooter>
      <Button
        disabled={!form.formState.isDirty}
        isLoading={form.formState.isSubmitting}
        type="submit"
      >
        Save
      </Button>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
    </DialogFooter>
  );
}
