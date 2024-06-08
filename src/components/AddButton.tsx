import { PlusCircle } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

const AddButton = (props: ButtonProps) => {
  const { ...rest } = props;

  return (
    <Button variant="icon" size="icon" {...rest}>
      <PlusCircle width={20} height={20} />
    </Button>
  );
};

export default AddButton;
