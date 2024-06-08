"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import keyBy from "lodash/keyBy";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FormControl } from "./form";
import { ScrollArea } from "./scroll-area";

export type ComboboxOption = {
  value: string;
  label: string;
};

type Mode = "single" | "multiple";

export interface ComboboxExternalProps {
  mode?: Mode;
  options: ComboboxOption[];
  className?: string;
  placeholder?: string;
  onCreate?: (value: string) => void;
  isLoading?: boolean;
}

// internal props come from react hook form when instantiated through select.tsx
interface ComboboxProps extends ComboboxExternalProps {
  value: string | string[];
  skipForm?: boolean;
  onChange?: (event: string | string[]) => void;
}

export function Combobox({
  options,
  value,
  className,
  skipForm,
  placeholder,
  mode = "single",
  onChange,
  onCreate,
  isLoading,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");

  const isMultiSelect = mode === "multiple";

  const selectedLabel = React.useMemo(() => {
    if (isLoading || !options?.length) {
      return "Loading...";
    }
    const optionsMap = keyBy(options, "value");

    if (isMultiSelect && Array.isArray(value)) {
      return value.map((selectedValue) => (
        <Badge variant={"outline"} key={selectedValue}>
          {optionsMap[selectedValue]?.label}
        </Badge>
      ));
    } else if (!isMultiSelect && typeof value === "string") {
      return <Badge>{optionsMap[value]?.label}</Badge>;
    }

    return "Incorrect mode";
  }, [options, value, isMultiSelect, isLoading]);

  const handleSelect = (newValue: string) => {
    if (!onChange || !newValue || isLoading) {
      return;
    }
    if (isMultiSelect && Array.isArray(value)) {
      onChange(
        value.includes(newValue)
          ? value.filter((item) => item !== newValue)
          : [...value, newValue]
      );
    } else {
      onChange(newValue);
    }
  };

  const ControlComponent = skipForm ? "div" : FormControl;
  return (
    <div className={cn("block", className)}>
      <Popover open={open} modal={true} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ControlComponent>
            <Button
              key={"combobox-trigger"}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto min-h-10 px-2"
            >
              {value?.length > 0 ? (
                <div className="flex max-w-full flex-grow flex-wrap gap-1">
                  {selectedLabel}
                </div>
              ) : (
                placeholder ?? "Select Item..."
              )}
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-8 ml-2" />
              ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </ControlComponent>
        </PopoverTrigger>
        <PopoverContent className="w-72 max-w-sm p-0">
          <Command
            filter={(val: string, search: string) => {
              if (val.toLowerCase().includes(search.toLowerCase())) return 1;
              return 0;
            }}
          >
            <CommandInput
              placeholder={placeholder ?? "Search..."}
              value={query}
              onValueChange={setQuery}
            />
            <CommandEmpty
              onClick={() => {
                if (onCreate) {
                  onCreate(query);
                  setQuery("");
                }
              }}
              className="flex items-center justify-center p-5 italic"
            >
              {!!onCreate ? (
                <p className="cursor-pointer block max-w-48 truncate font-semibold text-primary">
                  Create:{" "}
                  <span className="font-semibold text-primary truncate max-w-48">
                    {query}
                  </span>
                </p>
              ) : (
                "No results found."
              )}
            </CommandEmpty>
            <ScrollArea>
              <CommandList>
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
