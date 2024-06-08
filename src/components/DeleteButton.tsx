import { X } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

const DeleteButton = (props: ButtonProps) => {
  const { className = "", ...rest } = props;

  return (
    <Button variant="icon" size="icon" {...rest}>
      <X width={20} height={20} />
    </Button>
  );
};

export default DeleteButton;
