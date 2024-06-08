import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

export default function PackageTypeSelect(props: SelectProps) {
  const { value, onValueChange } = props;

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[50%]">
        <SelectValue placeholder="Select package type" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectItem value="basic">Basic</SelectItem>
          <SelectItem value="standart">Standart</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
