"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type option = { name: string; isoCode: string; [key: string]: any }
export function CountrySelector({
  options,
  placeholder,
  selected,
  setSelected
}: {
  options: option[];
  placeholder?: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>
}) {
  const [open, setOpen] = React.useState(false);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between block"
        >
          {selected
            ? options.find((option) => option.isoCode === selected)?.name
            : placeholder ?? "Select"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No countries</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.isoCode}
                  value={option.isoCode}
                  onSelect={(currentValue) => {
                    setSelected(currentValue === selected ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selected === option.isoCode ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
