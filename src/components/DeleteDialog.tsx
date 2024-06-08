import { useState } from "react";
import { ButtonProps, Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog";
import DeleteButton from "./DeleteButton";
import { Loader2 } from "lucide-react";

interface DeleteDialogProps {
  handleDelete: () => void;
  isLoading?: boolean;
  buttonProps?: ButtonProps;
}

const DeleteDialog = ({
  buttonProps,
  handleDelete,
  isLoading,
}: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);

  const onDeleteClick = () => {
    handleDelete();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
        ) : (
          <DeleteButton {...buttonProps} />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span>Are you sure you want to delete this item?</span>
            <span className="block text-red-700 mt-2">
              This action is irreversible
            </span>
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={onDeleteClick} variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
