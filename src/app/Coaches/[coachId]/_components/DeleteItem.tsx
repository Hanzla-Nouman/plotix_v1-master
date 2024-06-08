"use client";

import { ButtonProps } from "@/components/ui/button";
import DeleteDialog from "@/components/DeleteDialog";
import { trpc } from "@/trpc/client";

interface DeleteItemProps {
  triggerProps?: ButtonProps;
  entityId: string;
  entityName: "coachingPackage" | "portfolioItem" | "workExperience";
}

const DeleteItem = (props: DeleteItemProps) => {
  const { entityId, entityName, triggerProps } = props;
  const queryClient = trpc.useUtils();
  const { mutateAsync, isLoading } = trpc[entityName].delete.useMutation();

  const handleDelete = async () => {
    await mutateAsync({ where: { id: entityId } });

    queryClient.coach.get.invalidate();
  };

  return (
    <DeleteDialog
      buttonProps={triggerProps}
      isLoading={isLoading}
      handleDelete={handleDelete}
    />
  );
};

export default DeleteItem;
