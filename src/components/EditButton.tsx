import { Pencil } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

const EditButton = (props: ButtonProps) => {
  const { color, ...rest } = props;

  return (
    <Button variant="icon" size="icon" {...rest}>
      <Pencil color={color} width={20} height={20} />
    </Button>
  );
};

export default EditButton;
